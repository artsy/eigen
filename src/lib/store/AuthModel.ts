import { action, Action, Computed, computed, StateMapper, thunk, Thunk, thunkOn, ThunkOn } from "easy-peasy"
import { isArtsyEmail } from "lib/utils/general"
import { SegmentTrackingProvider } from "lib/utils/track/SegmentTrackingProvider"
import { stringify } from "qs"
import { Alert, Platform } from "react-native"
import Config from "react-native-config"
import { AccessToken, GraphRequest, GraphRequestManager, LoginManager } from "react-native-fbsdk-next"
import type { GlobalStoreModel } from "./GlobalStoreModel"
type BasicHttpMethod = "GET" | "PUT" | "POST" | "DELETE"

export interface AuthModel {
  // State
  userID: string | null
  androidUserEmail: string | null
  userAccessToken: string | null
  userAccessTokenExpiresIn: string | null
  xAppToken: string | null
  xApptokenExpiresIn: string | null
  onboardingState: "none" | "incomplete" | "complete"

  userEmail: Computed<this, string | null, GlobalStoreModel>
  userHasArtsyEmail: Computed<this, boolean, GlobalStoreModel>

  // Actions
  setState: Action<AuthModel, Partial<StateMapper<AuthModel, "1">>>
  getXAppToken: Thunk<AuthModel, void, {}, GlobalStoreModel, Promise<string>>
  userExists: Thunk<AuthModel, { email: string }, {}, GlobalStoreModel>
  signIn: Thunk<
    AuthModel,
    {
      email: string
      password?: string
      accessToken?: string
      oauthProvider?: "facebook" | "google" | "apple"
    },
    {},
    GlobalStoreModel,
    Promise<boolean>
  >
  signUp: Thunk<
    AuthModel,
    {
      email: string
      name: string
      password?: string
      accessToken?: string
      oauthProvider?: "facebook" | "google" | "apple"
    },
    {},
    GlobalStoreModel,
    Promise<true | Response>
  >
  authFacebook: Thunk<AuthModel, void, {}, GlobalStoreModel, Promise<void>>
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
  androidUserEmail: null,
  userAccessToken: null,
  userAccessTokenExpiresIn: null,
  xAppToken: null,
  xApptokenExpiresIn: null,
  onboardingState: "none",
  userEmail: computed([(_, store) => store], (store) => {
    if (Platform.OS === "ios") {
      return store.native.sessionState.userEmail
    } else if (Platform.OS === "android") {
      return store.auth.androidUserEmail
    }
    return null
  }),
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
        "User-Agent": context.getStoreState().native.sessionState.userAgent,
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
        "User-Agent": context.getStoreState().native.sessionState.userAgent,
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
  signIn: thunk(async (actions, { email, password, accessToken, oauthProvider }) => {
    let body
    if (oauthProvider === "facebook") {
      body = {
        oauth_provider: "facebook",
        oauth_token: accessToken,
        client_id: Config.ARTSY_API_CLIENT_KEY,
        client_secret: Config.ARTSY_API_CLIENT_SECRET,
        grant_type: "oauth_token",
        scope: "offline_access",
      }
    } else {
      body = {
        email,
        password,
        client_id: Config.ARTSY_API_CLIENT_KEY,
        client_secret: Config.ARTSY_API_CLIENT_SECRET,
        grant_type: "credentials",
        scope: "offline_access",
      }
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
        androidUserEmail: email,
      })
      actions.notifyTracking({ userId: id })

      return true
    }

    return false
  }),
  signUp: thunk(async (actions, { email, password, name, accessToken, oauthProvider }) => {
    let body
    if (oauthProvider === "facebook") {
      body = {
        provider: "facebook",
        oauth_token: accessToken,
        email,
        name,
        agreed_to_receive_emails: true,
        accepted_terms_of_service: true,
      }
    } else {
      body = {
        email,
        password,
        name,
        agreed_to_receive_emails: true,
        accepted_terms_of_service: true,
      }
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
      await actions.signIn({ email, password, accessToken, oauthProvider })
      actions.setState({
        onboardingState: "incomplete",
      })
      return true
    }
    return result
  }),
  authFacebook: thunk(async (actions) => {
    const { declinedPermissions, isCancelled } = await LoginManager.logInWithPermissions(["public_profile", "email"])
    if (declinedPermissions?.includes("email")) {
      Alert.alert("Error", "Please allow the use of email to continue.", [{ text: "Ok" }])
    }
    const accessToken =
      !isCancelled && !declinedPermissions?.includes("email") && (await AccessToken.getCurrentAccessToken())
    if (!accessToken) {
      return
    }

    const responseFacebookInfoCallback = async (error: any, facebookInfo: { email: string; name: string }) => {
      if (error) {
        Alert.alert("Error", "Error fetching data.", [{ text: "Ok" }])
      } else {
        // sign up
        const resultGravitySignUp = await actions.signUp({
          email: facebookInfo.email,
          name: facebookInfo.name,
          accessToken: accessToken.accessToken,
          oauthProvider: "facebook",
        })

        // if sign up failed
        if (resultGravitySignUp !== true) {
          const resultGravitySignUpJSON = await resultGravitySignUp.json()

          switch (resultGravitySignUpJSON.error) {
            case "Another Account Already Linked":
              // this facebook account is already an artsy account
              // let's log them in

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
                await actions.signIn({ email, accessToken: accessToken.accessToken, oauthProvider: "facebook" })
              }

              break
            case "User Already Exists":
            case "User Already Invited":
              // there's already a user with this email
              Alert.alert("Error", "User already exists with this email. Please log in with your email and password.", [
                { text: "Ok" },
              ])

              break
            default:
              // something else went wrong
              Alert.alert("Error", "Couldn't link Facebook account.", [{ text: "Ok" }])
              break
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
