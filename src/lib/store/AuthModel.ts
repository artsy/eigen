import { appleAuth } from "@invertase/react-native-apple-authentication"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { action, Action, Computed, computed, StateMapper, thunk, Thunk, thunkOn, ThunkOn } from "easy-peasy"
import { isArtsyEmail } from "lib/utils/general"
import { SegmentTrackingProvider } from "lib/utils/track/SegmentTrackingProvider"
import { stringify } from "qs"
import Config from "react-native-config"
import { AccessToken, GraphRequest, GraphRequestManager, LoginManager } from "react-native-fbsdk-next"
import { getCurrentEmissionState } from "./GlobalStore"
import type { GlobalStoreModel } from "./GlobalStoreModel"
type BasicHttpMethod = "GET" | "PUT" | "POST" | "DELETE"

export interface AuthModel {
  // State
  userID: string | null
  userAccessToken: string | null
  userAccessTokenExpiresIn: string | null
  xAppToken: string | null
  xApptokenExpiresIn: string | null
  onboardingState: "none" | "incomplete" | "complete"
  userEmail: string | null

  userHasArtsyEmail: Computed<this, boolean, GlobalStoreModel>

  // Actions
  setState: Action<AuthModel, Partial<StateMapper<AuthModel, "1">>>
  getXAppToken: Thunk<AuthModel, void, {}, GlobalStoreModel, Promise<string>>
  userExists: Thunk<AuthModel, { email: string }, {}, GlobalStoreModel>
  signIn: Thunk<
    AuthModel,
    | {
        email: string
        password: string

        accessToken?: never
        oauthProvider?: never
        idToken?: never
        appleUID?: never
      }
    | {
        email: string
        oauthProvider: "facebook" | "google"
        accessToken: string

        password?: never
        idToken?: never
        appleUID?: never
      }
    | {
        email: string
        oauthProvider: "apple"
        idToken: string
        appleUID: string

        password?: never
        accessToken?: never
      },
    {},
    GlobalStoreModel,
    Promise<boolean>
  >
  signUp: Thunk<
    AuthModel,
    | {
        email: string
        name: string
        password: string

        accessToken?: never
        oauthProvider?: never
        idToken?: never
        appleUID?: never
      }
    | {
        email: string
        name: string
        accessToken: string
        oauthProvider: "facebook" | "google"

        password?: never
        idToken?: never
        appleUID?: never
      }
    | {
        email: string
        name: string
        oauthProvider: "apple"
        idToken: string
        appleUID: string

        password?: never
        accessToken?: never
      },
    {},
    GlobalStoreModel,
    Promise<boolean>
  >
  authFacebook: Thunk<AuthModel, { signInOrUp: "signIn" | "signUp" }, {}, GlobalStoreModel, Promise<true>>
  authGoogle: Thunk<AuthModel, { signInOrUp: "signIn" | "signUp" }, {}, GlobalStoreModel, Promise<true>>
  authApple: Thunk<AuthModel, undefined, {}, GlobalStoreModel, Promise<true>>
  forgotPassword: Thunk<AuthModel, { email: string }, {}, GlobalStoreModel, Promise<boolean>>
  gravityUnauthenticatedRequest: Thunk<
    this,
    {
      path: string
      method?: BasicHttpMethod
      body?: object
      headers?: RequestInit["headers"]
    },
    {},
    GlobalStoreModel,
    ReturnType<typeof fetch>
  >

  notifyTracking: Thunk<this, { userId: string | null }>
  didRehydrate: ThunkOn<this, {}, GlobalStoreModel>
}

export const getAuthModel = (): AuthModel => ({
  userID: null,
  userAccessToken: null,
  userAccessTokenExpiresIn: null,
  xAppToken: null,
  xApptokenExpiresIn: null,
  onboardingState: "none",
  userEmail: null,
  userHasArtsyEmail: computed((state) => isArtsyEmail(state.userEmail ?? "")),

  setState: action((state, payload) => Object.assign(state, payload)),
  getXAppToken: thunk(async (actions, _payload, context) => {
    const xAppToken = context.getState().xAppToken
    if (xAppToken) {
      // TODO: handle expiry
      return xAppToken
    }
    const gravityBaseURL = context.getStoreState().config.environment.strings.gravityURL
    const tokenURL = `${gravityBaseURL}/api/v1/xapp_token?${stringify({
      client_id: Config.ARTSY_API_CLIENT_KEY,
      client_secret: Config.ARTSY_API_CLIENT_SECRET,
    })}`
    const result = await fetch(tokenURL, {
      headers: {
        "User-Agent": getCurrentEmissionState().userAgent,
      },
    })
    // TODO: check status
    const json = (await result.json()) as {
      xapp_token: string
      expires_in: string
    }
    if (json.xapp_token) {
      actions.setState({
        xAppToken: json.xapp_token,
        xApptokenExpiresIn: json.expires_in,
      })
      return json.xapp_token
    }
    throw new Error("Unable to get x-app-token from " + tokenURL)
  }),
  gravityUnauthenticatedRequest: thunk(async (actions, payload, context) => {
    const gravityBaseURL = context.getStoreState().config.environment.strings.gravityURL
    const xAppToken = await actions.getXAppToken()

    return await fetch(`${gravityBaseURL}${payload.path}`, {
      method: payload.method || "GET",
      headers: {
        "X-Xapp-Token": xAppToken,
        Accept: "application/json",
        "User-Agent": getCurrentEmissionState().userAgent,
        ...payload.headers,
      },
      body: payload.body ? JSON.stringify(payload.body) : undefined,
    })
  }),
  userExists: thunk(async (actions, { email }) => {
    const result = await actions.gravityUnauthenticatedRequest({
      path: `/api/v1/user?${stringify({ email })}`,
    })
    if (result.status === 200) {
      return true
    } else if (result.status === 404) {
      return false
    } else {
      throw new Error(JSON.stringify(await result.json()))
    }
  }),
  forgotPassword: thunk(async (actions, { email }) => {
    const result = await actions.gravityUnauthenticatedRequest({
      path: `/api/v1/users/send_reset_password_instructions`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        email,
      },
    })

    // For security purposes we don't want to disclose when a user is not found
    // this is indicated by 400 on gravity side, treat as success
    if (result.ok || result.status === 400) {
      return true
    }
    return false
  }),
  signIn: thunk(async (actions, { email, password, accessToken, oauthProvider, idToken, appleUID }) => {
    let body
    switch (oauthProvider) {
      case "facebook":
      case "google":
        body = {
          oauth_provider: oauthProvider,
          oauth_token: accessToken,
          client_id: Config.ARTSY_API_CLIENT_KEY,
          client_secret: Config.ARTSY_API_CLIENT_SECRET,
          grant_type: "oauth_token",
          scope: "offline_access",
        }
        break
      case "apple":
        body = {
          oauth_provider: oauthProvider,
          apple_uid: appleUID,
          id_token: idToken,
          client_id: Config.ARTSY_API_CLIENT_KEY,
          client_secret: Config.ARTSY_API_CLIENT_SECRET,
          grant_type: "apple_uid",
          scope: "offline_access",
        }
        break
      default:
        body = {
          email,
          password,
          client_id: Config.ARTSY_API_CLIENT_KEY,
          client_secret: Config.ARTSY_API_CLIENT_SECRET,
          grant_type: "credentials",
          scope: "offline_access",
        }
        break
    }

    const result = await actions.gravityUnauthenticatedRequest({
      path: `/oauth2/access_token`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    })

    if (result.status === 201) {
      const { expires_in, access_token } = await result.json()
      const { id } = await (
        await actions.gravityUnauthenticatedRequest({
          path: `/api/v1/user?${stringify({ email })}`,
        })
      ).json()

      actions.setState({
        userAccessToken: access_token,
        userAccessTokenExpiresIn: expires_in,
        userID: id,
        userEmail: email,
      })
      actions.notifyTracking({ userId: id })

      return true
    }

    return false
  }),
  signUp: thunk(async (actions, { email, password, name, accessToken, oauthProvider, idToken, appleUID }) => {
    let body
    switch (oauthProvider) {
      case "facebook":
      case "google":
        body = {
          provider: oauthProvider,
          oauth_token: accessToken,
          email,
          name,
          agreed_to_receive_emails: true,
          accepted_terms_of_service: true,
        }
        break
      case "apple":
        body = {
          provider: oauthProvider,
          apple_uid: appleUID,
          id_token: idToken,
          email,
          name,
          agreed_to_receive_emails: true,
          accepted_terms_of_service: true,
        }
        break
      default:
        body = {
          email,
          password,
          name,
          agreed_to_receive_emails: true,
          accepted_terms_of_service: true,
        }
        break
    }

    const result = await actions.gravityUnauthenticatedRequest({
      path: `/api/v1/user`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    })

    // The user account has been successfully created
    if (result.status === 201) {
      // @ts-ignore
      await actions.signIn({ email, password, accessToken, oauthProvider, idToken, appleUID })
      actions.setState({
        onboardingState: "incomplete",
      })
      return true
    }
    return false
  }),
  authFacebook: thunk(async (actions, { signInOrUp }) => {
    return await new Promise<true>(async (resolve, reject) => {
      const { declinedPermissions, isCancelled } = await LoginManager.logInWithPermissions(["public_profile", "email"])
      if (declinedPermissions?.includes("email")) {
        reject("Please allow the use of email to continue.")
      }
      const accessToken = !isCancelled && (await AccessToken.getCurrentAccessToken())
      if (!accessToken) {
        return
      }

      const responseFacebookInfoCallback = async (
        error: { message: string },
        facebookInfo: { email?: string; name: string }
      ) => {
        if (error) {
          reject(`Error fetching facebook data: ${error.message}`)
          return
        }
        if (!facebookInfo.email) {
          reject(
            "We can’t find an email associated with your Facebook account. Please sign up with your email and password."
          )
          return
        }

        if (signInOrUp === "signUp") {
          const resultGravitySignUp = await actions.signUp({
            email: facebookInfo.email,
            name: facebookInfo.name,
            accessToken: accessToken.accessToken,
            oauthProvider: "facebook",
          })

          resultGravitySignUp ? resolve(true) : reject("Failed to sign up.")
        }

        if (signInOrUp === "signIn") {
          // we need to get X-ACCESS-TOKEN before actual sign in
          const resultGravityAccessToken = await actions.gravityUnauthenticatedRequest({
            path: `/oauth2/access_token`,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: {
              oauth_provider: "facebook",
              oauth_token: accessToken.accessToken,
              client_id: Config.ARTSY_API_CLIENT_KEY,
              client_secret: Config.ARTSY_API_CLIENT_SECRET,
              grant_type: "oauth_token",
              scope: "offline_access",
            },
          })

          if (resultGravityAccessToken.status === 201) {
            const { access_token: xAccessToken } = await resultGravityAccessToken.json() // here's the X-ACCESS-TOKEN we needed now we can get user's email and sign in
            const resultGravityEmail = await actions.gravityUnauthenticatedRequest({
              path: `/api/v1/me`,
              headers: { "X-ACCESS-TOKEN": xAccessToken },
            })
            const { email } = await resultGravityEmail.json()
            const resultGravitySignIn = await actions.signIn({
              email,
              accessToken: accessToken.accessToken,
              oauthProvider: "facebook",
            })

            resultGravitySignIn ? resolve(true) : reject("Failed to log in.")
          } else {
            const res = await resultGravityAccessToken.json()
            if (res.error_description) {
              console.log(res) // This will get us the error on sentry because we capture console.logs there
              reject(`Failed to get gravity token from gravity: ${res.error_description}`)
            }
          }
        }
      }

      // get info from facebook
      const infoRequest = new GraphRequest(
        "/me",
        {
          accessToken: accessToken.accessToken,
          parameters: {
            fields: {
              string: "email,name",
            },
          },
        },
        responseFacebookInfoCallback
      )
      new GraphRequestManager().addRequest(infoRequest).start()
    })
  }),
  authGoogle: thunk(async (actions, { signInOrUp }) => {
    return await new Promise<true>(async (resolve, reject) => {
      if (!(await GoogleSignin.hasPlayServices())) {
        reject("Play services are not available.")
      }
      const userInfo = await GoogleSignin.signIn()
      const accessToken = (await GoogleSignin.getTokens()).accessToken

      if (signInOrUp === "signUp") {
        const resultGravitySignUp =
          userInfo.user.name &&
          (await actions.signUp({
            email: userInfo.user.email,
            name: userInfo.user.name,
            accessToken,
            oauthProvider: "google",
          }))

        resultGravitySignUp ? resolve(true) : reject("Failed to sign up.")
      }

      if (signInOrUp === "signIn") {
        // we need to get X-ACCESS-TOKEN before actual sign in
        const resultGravityAccessToken = await actions.gravityUnauthenticatedRequest({
          path: `/oauth2/access_token`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            oauth_provider: "google",
            oauth_token: accessToken,
            client_id: Config.ARTSY_API_CLIENT_KEY,
            client_secret: Config.ARTSY_API_CLIENT_SECRET,
            grant_type: "oauth_token",
            scope: "offline_access",
          },
        })

        if (resultGravityAccessToken.status === 201) {
          const { access_token: xAccessToken } = await resultGravityAccessToken.json() // here's the X-ACCESS-TOKEN we needed now we can get user's email and sign in
          const resultGravityEmail = await actions.gravityUnauthenticatedRequest({
            path: `/api/v1/me`,
            headers: { "X-ACCESS-TOKEN": xAccessToken },
          })
          const { email } = await resultGravityEmail.json()
          const resultGravitySignIn = await actions.signIn({
            email,
            accessToken,
            oauthProvider: "google",
          })

          resultGravitySignIn ? resolve(true) : reject("Failed to log in.")
        } else {
          const res = await resultGravityAccessToken.json()
          if (res.error_description) {
            console.log(res) // This will get us the error on sentry because we capture console.logs there
            reject(`Failed to get gravity token from gravity: ${res.error_description}`)
          }
        }
      }
    })
  }),
  authApple: thunk(async (actions) => {
    return await new Promise<true>(async (resolve, reject) => {
      // we cannot have separated logic for sign in and sign up with apple, as with google or facebook,
      // because apple returns email only on the FIRST auth attempt, so we run sign up and sign in one by one
      let signInOrUp: "signIn" | "signUp" = "signUp"

      const userInfo = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      })

      const idToken = userInfo.identityToken
      if (!idToken) {
        return reject("Failed to authenticate using apple sign in")
      }
      const appleUID = userInfo.user

      if (signInOrUp === "signUp") {
        const firstName = userInfo.fullName?.givenName ? userInfo.fullName.givenName : ""
        const lastName = userInfo.fullName?.familyName ? userInfo.fullName.familyName : ""

        const resultGravitySignUp =
          userInfo.email &&
          (await actions.signUp({
            email: userInfo.email,
            name: `${firstName} ${lastName}`.trim(),
            appleUID,
            idToken,
            oauthProvider: "apple",
          }))

        resultGravitySignUp ? resolve(true) : (signInOrUp = "signIn")
      }

      if (signInOrUp === "signIn") {
        // we need to get X-ACCESS-TOKEN before actual sign in
        const resultGravityAccessToken = await actions.gravityUnauthenticatedRequest({
          path: `/oauth2/access_token`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            oauth_provider: "apple",
            apple_uid: appleUID,
            id_token: idToken,
            client_id: Config.ARTSY_API_CLIENT_KEY,
            client_secret: Config.ARTSY_API_CLIENT_SECRET,
            grant_type: "apple_uid",
            scope: "offline_access",
          },
        })
        if (resultGravityAccessToken.status === 201) {
          const { access_token: xAccessToken } = await resultGravityAccessToken.json() // here's the X-ACCESS-TOKEN we needed now we can get user's email and sign in
          const resultGravityEmail = await actions.gravityUnauthenticatedRequest({
            path: `/api/v1/me`,
            headers: { "X-ACCESS-TOKEN": xAccessToken },
          })
          const { email } = await resultGravityEmail.json()
          const resultGravitySignIn = await actions.signIn({
            email,
            appleUID,
            idToken,
            oauthProvider: "apple",
          })

          resultGravitySignIn ? resolve(true) : reject("Failed to log in.")
        } else {
          const res = await resultGravityAccessToken.json()
          if (res.error_description) {
            console.log(res) // This will get us the error on sentry because we capture console.logs there
            reject(`Failed to get gravity token from gravity: ${res.error_description}`)
          }
        }
      }
    })
  }),
  notifyTracking: thunk((_, { userId }) => {
    SegmentTrackingProvider.identify?.(userId, { is_temporary_user: userId === null ? 1 : 0 })
  }),
  didRehydrate: thunkOn(
    (_, storeActions) => storeActions.rehydrate,
    (actions, __, store) => {
      actions.notifyTracking({ userId: store.getState().userID })
    }
  ),
})
