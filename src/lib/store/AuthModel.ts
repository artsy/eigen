import { ActionType, AuthService, CreatedAccount } from "@artsy/cohesion"
import { appleAuth } from "@invertase/react-native-apple-authentication"
import CookieManager from "@react-native-cookies/cookies"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { action, Action, Computed, computed, StateMapper, thunk, Thunk, thunkOn, ThunkOn } from "easy-peasy"
import * as RelayCache from "lib/relay/RelayCache"
import { isArtsyEmail } from "lib/utils/general"
import { getNotificationPermissionsStatus, PushAuthorizationStatus } from "lib/utils/PushNotification"
import { postEventToProviders } from "lib/utils/track/providers"
import { SegmentTrackingProvider } from "lib/utils/track/SegmentTrackingProvider"
import { capitalize } from "lodash"
import { stringify } from "qs"
import { Alert, Linking, Platform } from "react-native"
import Config from "react-native-config"
import { AccessToken, GraphRequest, GraphRequestManager, LoginManager } from "react-native-fbsdk-next"
import Keychain from "react-native-keychain"
import { LegacyNativeModules } from "../NativeModules/LegacyNativeModules"
import { getCurrentEmissionState } from "./GlobalStore"
import type { GlobalStoreModel } from "./GlobalStoreModel"

type BasicHttpMethod = "GET" | "PUT" | "POST" | "DELETE"

const afterSocialAuthLogin = (res: any, reject: (reason?: any) => void, provider: "facebook" | "apple" | "google") => {
  const providerName = capitalize(provider)
  if (res.error_description) {
    if (res.error_description.includes("no account linked to oauth token")) {
      reject(
        `There is no email associated with your ${providerName} account. Please log in using your email and password instead.`
      )
    } else {
      reject("Login attempt failed")
    }
  }
}

type SignInStatus = "failure" | "success" | "otp_missing" | "invalid_otp"

type OnboardingState = "none" | "incomplete" | "complete"
export interface AuthModel {
  // State
  userID: string | null
  userAccessToken: string | null
  userAccessTokenExpiresIn: string | null
  xAppToken: string | null
  xApptokenExpiresIn: string | null
  onboardingState: OnboardingState
  userEmail: string | null
  previousSessionUserID: string | null

  userHasArtsyEmail: Computed<this, boolean, GlobalStoreModel>

  // Actions
  setState: Action<this, Partial<StateMapper<this, "1">>>
  getXAppToken: Thunk<this, void, {}, GlobalStoreModel, Promise<string>>
  userExists: Thunk<this, { email: string }, {}, GlobalStoreModel>
  signIn: Thunk<
    this,
    { email: string; onboardingState?: OnboardingState } & (
      | {
          oauthProvider: "email"
          password: string
          otp?: string
        }
      | {
          oauthProvider: "facebook" | "google"
          accessToken: string
        }
      | {
          oauthProvider: "apple"
          idToken: string
          appleUID: string
        }
    ),
    {},
    GlobalStoreModel,
    Promise<SignInStatus>
  >
  signUp: Thunk<
    this,
    { email: string; name: string; agreedToReceiveEmails: boolean } & (
      | {
          oauthProvider: "email"
          password: string
        }
      | {
          oauthProvider: "facebook" | "google"
          accessToken: string
        }
      | {
          oauthProvider: "apple"
          idToken: string
          appleUID: string
        }
    ),
    {},
    GlobalStoreModel,
    Promise<{ success: boolean; message?: string }>
  >
  authFacebook: Thunk<
    this,
    { signInOrUp: "signIn" } | { signInOrUp: "signUp"; agreedToReceiveEmails: boolean },
    {},
    GlobalStoreModel,
    Promise<true>
  >
  authGoogle: Thunk<
    this,
    { signInOrUp: "signIn" } | { signInOrUp: "signUp"; agreedToReceiveEmails: boolean },
    {},
    GlobalStoreModel,
    Promise<true>
  >
  authApple: Thunk<this, { agreedToReceiveEmails?: boolean }, {}, GlobalStoreModel, Promise<true>>
  forgotPassword: Thunk<this, { email: string }, {}, GlobalStoreModel, Promise<boolean>>
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
  signOut: Thunk<this>

  notifyTracking: Thunk<this, { userId: string | null }>
  requestPushNotifPermission: Thunk<this>
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
  previousSessionUserID: null,
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
  signIn: thunk(async (actions, args, store) => {
    const { oauthProvider, email, onboardingState } = args

    const grantTypeMap = {
      facebook: "oauth_token",
      google: "oauth_token",
      apple: "apple_uid",
      email: "credentials",
    }

    const result = await actions.gravityUnauthenticatedRequest({
      path: `/oauth2/access_token`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        email,
        oauth_provider: oauthProvider,
        otp_attempt: oauthProvider === "email" ? args?.otp ?? undefined : undefined,
        password: oauthProvider === "email" ? args.password : undefined,
        oauth_token: oauthProvider === "facebook" || oauthProvider === "google" ? args.accessToken : undefined,
        apple_uid: oauthProvider === "apple" ? args.appleUID : undefined,
        id_token: oauthProvider === "apple" ? args.idToken : undefined,
        grant_type: grantTypeMap[oauthProvider],
        client_id: Config.ARTSY_API_CLIENT_KEY,
        client_secret: Config.ARTSY_API_CLIENT_SECRET,
        scope: "offline_access",
      },
    })

    if (result.status === 201) {
      const { expires_in, access_token } = await result.json()
      const user = await (
        await actions.gravityUnauthenticatedRequest({
          path: `/api/v1/me`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-ACCESS-TOKEN": access_token,
          },
        })
      ).json()

      actions.setState({
        userAccessToken: access_token,
        userAccessTokenExpiresIn: expires_in,
        userID: user.id,
        userEmail: email,
        onboardingState: onboardingState ?? "complete",
      })

      if (oauthProvider === "email") {
        Keychain.setInternetCredentials(
          store.getStoreState().config.environment.strings.webURL.slice("https://".length),
          email,
          args.password
        )
      }

      if (user.id !== store.getState().previousSessionUserID) {
        store.getStoreActions().search.clearRecentSearches()
      }

      actions.notifyTracking({ userId: user.id })
      postEventToProviders(tracks.loggedIn(oauthProvider))

      // Keep native iOS in sync with react-native auth state
      if (Platform.OS === "ios") {
        requestAnimationFrame(() => {
          LegacyNativeModules.ArtsyNativeModule.updateAuthState(access_token, expires_in, user)
        })
      }

      if (!onboardingState || onboardingState === "complete" || onboardingState === "none") {
        actions.requestPushNotifPermission()
      }

      return "success"
    }

    const resultJSON = await result.json()
    if (resultJSON?.error === "otp_missing") {
      return "otp_missing"
    }

    if (resultJSON?.error_description === "invalid two-factor authentication code") {
      return "invalid_otp"
    }

    return "failure"
  }),
  signUp: thunk(async (actions, args) => {
    const { oauthProvider, email, name, agreedToReceiveEmails } = args
    const result = await actions.gravityUnauthenticatedRequest({
      path: `/api/v1/user`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        provider: oauthProvider,
        email,
        name,

        password: oauthProvider === "email" ? args.password : undefined,
        oauth_token: oauthProvider === "facebook" || oauthProvider === "google" ? args.accessToken : undefined,
        apple_uid: oauthProvider === "apple" ? args.appleUID : undefined,
        id_token: oauthProvider === "apple" ? args.idToken : undefined,

        agreed_to_receive_emails: agreedToReceiveEmails,
        accepted_terms_of_service: true,
      },
    })

    // The user account has been successfully created
    if (result.status === 201) {
      postEventToProviders(tracks.createdAccount({ signUpMethod: oauthProvider }))

      switch (oauthProvider) {
        case "facebook":
        case "google":
          await actions.signIn({
            oauthProvider,
            email,
            accessToken: args.accessToken,
            onboardingState: "incomplete",
          })
          break
        case "apple":
          await actions.signIn({
            oauthProvider,
            email,
            idToken: args.idToken,
            appleUID: args.appleUID,
            onboardingState: "incomplete",
          })
          break
        case "email":
          await actions.signIn({
            oauthProvider,
            email,
            password: args.password,
            onboardingState: "incomplete",
          })
          break
        default:
          assertNever(oauthProvider)
      }

      return { success: true }
    }

    const resultJson = await result.json()
    let message = ""
    const providerName = capitalize(oauthProvider)
    if (resultJson?.error === "User Already Exists") {
      message = `Your ${providerName} email account is linked to an Artsy user account please Log in using your email and password instead.`
    } else if (resultJson?.error === "Another Account Already Linked") {
      message =
        `Your ${providerName} account is already linked to another Artsy account. ` +
        `Try logging out and back in with ${providerName}. Then consider ` +
        `deleting that user account and re-linking ${providerName}. `
    } else if (resultJson.message && resultJson.message.match("Unauthorized source IP address")) {
      message = `You could not create an account because your IP address was blocked by ${providerName}`
    } else {
      message = "Failed to sign up"
    }

    return { success: false, message }
  }),
  authFacebook: thunk(async (actions, options) => {
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
            "There is no email associated with your Facebook account. Please log in using your email and password instead."
          )
          return
        }

        if (options.signInOrUp === "signUp") {
          const resultGravitySignUp = await actions.signUp({
            email: facebookInfo.email,
            name: facebookInfo.name,
            accessToken: accessToken.accessToken,
            oauthProvider: "facebook",
            agreedToReceiveEmails: options.agreedToReceiveEmails,
          })

          resultGravitySignUp.success ? resolve(true) : reject(resultGravitySignUp.message)
        }

        if (options.signInOrUp === "signIn") {
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
              oauthProvider: "facebook",
              email,
              accessToken: accessToken.accessToken,
            })

            resultGravitySignIn ? resolve(true) : reject("Could not log in")
          } else {
            const res = await resultGravityAccessToken.json()
            afterSocialAuthLogin(res, reject, "facebook")
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
  authGoogle: thunk(async (actions, options) => {
    return await new Promise<true>(async (resolve, reject) => {
      if (!(await GoogleSignin.hasPlayServices())) {
        reject("Play services are not available.")
      }
      const userInfo = await GoogleSignin.signIn()
      const accessToken = (await GoogleSignin.getTokens()).accessToken

      if (options.signInOrUp === "signUp") {
        const resultGravitySignUp = userInfo.user.name
          ? await actions.signUp({
              email: userInfo.user.email,
              name: userInfo.user.name,
              accessToken,
              oauthProvider: "google",
              agreedToReceiveEmails: options.agreedToReceiveEmails,
            })
          : { success: false }

        resultGravitySignUp.success ? resolve(true) : reject(resultGravitySignUp.message)
      }

      if (options.signInOrUp === "signIn") {
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
            oauthProvider: "google",
            email,
            accessToken,
          })

          resultGravitySignIn ? resolve(true) : reject("Could not log in")
        } else {
          const res = await resultGravityAccessToken.json()
          afterSocialAuthLogin(res, reject, "google")
        }
      }
    })
  }),
  authApple: thunk(async (actions, { agreedToReceiveEmails }) => {
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

        const resultGravitySignUp = userInfo.email
          ? await actions.signUp({
              email: userInfo.email,
              name: `${firstName} ${lastName}`.trim(),
              appleUID,
              idToken,
              oauthProvider: "apple",
              agreedToReceiveEmails: !!agreedToReceiveEmails,
            })
          : { success: false }

        resultGravitySignUp.success ? resolve(true) : (signInOrUp = "signIn")
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
            oauthProvider: "apple",
            email,
            appleUID,
            idToken,
          })

          resultGravitySignIn ? resolve(true) : reject("Could not log in")
        } else {
          const res = await resultGravityAccessToken.json()
          afterSocialAuthLogin(res, reject, "apple")
        }
      }
    })
  }),
  signOut: thunk(async () => {
    const signOutGoogle = async () => {
      try {
        await GoogleSignin.revokeAccess()
        await GoogleSignin.signOut()
      } catch (error) {
        console.log("Failed to signout from Google")
        console.error(error)
      }
    }

    await Promise.all([
      Platform.OS === "ios" ? await LegacyNativeModules.ArtsyNativeModule.clearUserData() : Promise.resolve(),
      await signOutGoogle(),
      CookieManager.clearAll(),
      RelayCache.clearAll(),
    ])
  }),
  notifyTracking: thunk((_, { userId }) => {
    SegmentTrackingProvider.identify?.(userId, { is_temporary_user: userId === null ? 1 : 0 })
  }),
  requestPushNotifPermission: thunk(async () => {
    const pushNotificationsPermissionsStatus = await getNotificationPermissionsStatus()
    if (pushNotificationsPermissionsStatus !== PushAuthorizationStatus.Authorized) {
      setTimeout(() => {
        if (Platform.OS === "ios") {
          LegacyNativeModules.ARTemporaryAPIModule.requestPrepromptNotificationPermissions()
        } else {
          Alert.alert(
            "Artsy Would Like to Send You Notifications",
            "Turn on notifications to get important updates about artists you follow.",
            [
              { text: "Dismiss", style: "cancel" },
              { text: "Settings", onPress: () => Linking.openSettings() },
            ]
          )
        }
      }, 3000)
    }
  }),
  didRehydrate: thunkOn(
    (_, storeActions) => storeActions.rehydrate,
    (actions, __, store) => {
      actions.notifyTracking({ userId: store.getState().userID })
    }
  ),
})

const tracks = {
  createdAccount: ({ signUpMethod }: { signUpMethod: AuthService }): Partial<CreatedAccount> => ({
    action: ActionType.createdAccount,
    service: signUpMethod,
  }),
  loggedIn: (service: AuthService) => ({
    action: ActionType.successfullyLoggedIn,
    service,
  }),
}
