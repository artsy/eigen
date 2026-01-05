import { ActionType, AuthService, CreatedAccount, ResetYourPassword } from "@artsy/cohesion"
import Braze from "@braze/react-native-sdk"
import { appleAuth } from "@invertase/react-native-apple-authentication"
import AsyncStorage from "@react-native-async-storage/async-storage"
import CookieManager from "@react-native-cookies/cookies"
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin"
import * as Sentry from "@sentry/react-native"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { clearNavState } from "app/system/navigation/useReloadedDevNavigationState"
import { _globalCacheRef } from "app/system/relay/defaultEnvironment"
import {
  handleClassicFacebookAuth,
  handleClassicFacebookAuth2,
  handleLimitedFacebookAuth,
  handleLimitedFacebookAuth2,
  handleSignUpError,
  showError,
} from "app/utils/auth/authHelpers"
import { isArtsyEmail } from "app/utils/general"
import { SegmentTrackingProvider } from "app/utils/track/SegmentTrackingProvider"
import { postEventToProviders } from "app/utils/track/providers"

import { Action, Computed, StateMapper, Thunk, action, computed, thunk } from "easy-peasy"
import { stringify } from "qs"
import { Platform } from "react-native"
import { LoginManager, LoginTracking } from "react-native-fbsdk-next"
import Keychain from "react-native-keychain"
import Keys from "react-native-keys"
import SiftReactNative from "sift-react-native"
import { AuthError } from "./AuthError"
import { GlobalStore, getCurrentEmissionState } from "./GlobalStore"
import type { GlobalStoreModel } from "./GlobalStoreModel"

export type OAuthProvider = "email" | "facebook" | "apple" | "google"

type BasicHttpMethod = "GET" | "PUT" | "POST" | "DELETE"

type SignInStatus =
  | "failure"
  | "success"
  | "otp_missing"
  | "on_demand_otp_missing"
  | "invalid_otp"
  | "auth_blocked"

type VerifyUserStatus = "user_exists" | "user_does_not_exist" | "something_went_wrong"

interface EmailOAuthParams {
  oauthProvider: "email"
  oauthMode: "email"
  email: string
  password: string
  otp?: string
}
interface FacebookOAuthParams {
  oauthProvider: "facebook"
  oauthMode: "accessToken"
  accessToken: string
}

interface FacebookLimitedOAuthParams {
  oauthProvider: "facebook"
  oauthMode: "jwt"
  jwt: string
}
interface GoogleOAuthParams {
  oauthProvider: "google"
  oauthMode: "accessToken"
  accessToken: string
}
interface AppleOAuthParams {
  oauthProvider: "apple"
  oauthMode: "idToken"
  idToken: string
  appleUid: string
}

interface SignUpParams {
  email: string
  name: string
  agreedToReceiveEmails: boolean
}

type OAuthParams =
  | EmailOAuthParams
  | FacebookOAuthParams
  | GoogleOAuthParams
  | AppleOAuthParams
  | FacebookLimitedOAuthParams

export interface AuthPromiseResolveType {
  success: boolean
}
export interface AuthPromiseRejectType {
  error?: string
  message: string
  code?: string
  meta?: {
    email: string
    provider: OAuthProvider
    name?: string
    existingProviders?: OAuthProvider[]
    oauthToken?: string
    idToken?: string
    appleUid?: string
  }
}

type SessionState = {
  isLoading: boolean
  isUserIdentified: boolean
}

export interface AuthModel {
  // State
  sessionState: SessionState
  userID: string | null
  userAccessToken: string | null
  userAccessTokenExpiresIn: string | null
  xAppToken: string | null
  xApptokenExpiresIn: string | null
  userEmail: string | null
  previousSessionUserID: string | null

  userHasArtsyEmail: Computed<this, boolean, GlobalStoreModel>

  // Actions
  setState: Action<this, Partial<StateMapper<this>>>
  setSessionState: Action<this, Partial<SessionState>>
  getXAppToken: Thunk<this, void, {}, GlobalStoreModel, Promise<string>>
  getUser: Thunk<this, { accessToken: string }, {}, GlobalStoreModel>
  signIn: Thunk<
    this,
    { email: string; onSignIn?: () => void } & OAuthParams,
    {},
    GlobalStoreModel,
    Promise<SignInStatus>
  >
  signUp: Thunk<
    this,
    SignUpParams & OAuthParams,
    {},
    GlobalStoreModel,
    Promise<AuthPromiseResolveType & AuthPromiseRejectType>
  >
  authFacebook: Thunk<
    this,
    | { signInOrUp: "signIn"; onSignIn?: () => void }
    | { signInOrUp: "signUp"; agreedToReceiveEmails: boolean },
    {},
    GlobalStoreModel,
    Promise<AuthPromiseResolveType>
  >
  authFacebook2: Thunk<this, undefined, {}, GlobalStoreModel, Promise<AuthPromiseResolveType>>
  authGoogle: Thunk<
    this,
    | { signInOrUp: "signIn"; onSignIn?: () => void }
    | { signInOrUp: "signUp"; agreedToReceiveEmails: boolean },
    {},
    GlobalStoreModel,
    Promise<AuthPromiseResolveType>
  >
  authGoogle2: Thunk<this, undefined, {}, GlobalStoreModel, Promise<AuthPromiseResolveType>>
  authApple: Thunk<
    this,
    { agreedToReceiveEmails?: boolean; onSignIn?: () => void },
    {},
    GlobalStoreModel,
    Promise<AuthPromiseResolveType>
  >
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
  identifyUser: Action<this>
  signOut: Thunk<this>
  verifyUser: Thunk<
    this,
    { email: string; recaptchaToken: string },
    {},
    GlobalStoreModel,
    Promise<VerifyUserStatus>
  >
}

const clientKey = __DEV__
  ? Keys.secureFor("ARTSY_DEV_API_CLIENT_KEY")
  : Keys.secureFor("ARTSY_PROD_API_CLIENT_KEY")
const clientSecret = __DEV__
  ? Keys.secureFor("ARTSY_DEV_API_CLIENT_SECRET")
  : Keys.secureFor("ARTSY_PROD_API_CLIENT_SECRET")

export const getAuthModel = (): AuthModel => ({
  sessionState: {
    isLoading: false,
    isUserIdentified: false,
  },
  userID: null,
  userAccessToken: null,
  userAccessTokenExpiresIn: null,
  xAppToken: null,
  xApptokenExpiresIn: null,
  userEmail: null,
  previousSessionUserID: null,
  userHasArtsyEmail: computed((state) => isArtsyEmail(state.userEmail ?? "")),

  setState: action((state, payload) => Object.assign(state, payload)),
  setSessionState: action((state, payload) => {
    state.sessionState = { ...state.sessionState, ...payload }
  }),
  getXAppToken: thunk(async (actions, _payload, context) => {
    const xAppToken = context.getState().xAppToken
    const xAppTokenExpiresIn = context.getState().xApptokenExpiresIn
    if (xAppToken && xAppTokenExpiresIn && !isTokenExpired(xAppTokenExpiresIn)) {
      return xAppToken
    }
    const gravityBaseURL = context.getStoreState().devicePrefs.environment.strings.gravityURL
    const tokenURL = `${gravityBaseURL}/api/v1/xapp_token?${stringify({
      client_id: clientKey,
      client_secret: clientSecret,
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
    const gravityBaseURL = context.getStoreState().devicePrefs.environment.strings.gravityURL
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
      postEventToProviders(tracks.resetYourPassword())

      return true
    }
    return false
  }),
  getUser: thunk(async (actions, { accessToken }) => {
    return await (
      await actions.gravityUnauthenticatedRequest({
        path: `/api/v1/me`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-ACCESS-TOKEN": accessToken,
        },
      })
    ).json()
  }),
  signIn: thunk(async (actions, args, store) => {
    const { oauthProvider, oauthMode, email, onSignIn } = args

    const grantTypeMap = {
      accessToken: "oauth_token",
      idToken: "apple_uid",
      email: "credentials",
      jwt: "jwt",
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
        otp_attempt: oauthMode === "email" ? args?.otp ?? undefined : undefined,
        password: oauthMode === "email" ? args.password : undefined,
        oauth_token: oauthMode === "accessToken" ? args.accessToken : undefined,
        jwt: oauthMode === "jwt" ? args.jwt : undefined,
        apple_uid: oauthProvider === "apple" ? args.appleUid : undefined,
        id_token: oauthMode === "idToken" ? args.idToken : undefined,
        grant_type: grantTypeMap[oauthMode],
        client_id: clientKey,
        client_secret: clientSecret,
        scope: "offline_access",
      },
    })

    if (result.status === 403) {
      return "auth_blocked"
    }

    if (result.status === 201) {
      const { expires_in, access_token: userAccessToken } = await result.json()
      const user = await actions.getUser({ accessToken: userAccessToken })

      actions.setSessionState({
        isUserIdentified: false,
      })

      actions.setState({
        userAccessToken,
        userAccessTokenExpiresIn: expires_in,
        userID: user.id,
        userEmail: email,
      })

      GlobalStore.actions.onboarding.setOnboardingState("complete")
      // TODO: do we need to set requested push permissions false here

      if (oauthProvider === "email") {
        Keychain.setInternetCredentials(
          store.getStoreState().devicePrefs.environment.strings.webURL.slice("https://".length),
          email,
          args.password
        )
      }

      actions.identifyUser()

      if (user.id !== store.getState().previousSessionUserID) {
        const storeActions = store.getStoreActions()

        storeActions.search.clearRecentSearches()
        storeActions.recentPriceRanges.clearAllPriceRanges()
        storeActions.progressiveOnboarding.reset()
      }

      postEventToProviders(tracks.loggedIn(oauthProvider))

      onSignIn?.()

      // Setting up user prefs from gravity after successsfull login.
      GlobalStore.actions.userPrefs.fetchRemoteUserPrefs()

      return "success"
    }

    const { error_description: errorDescription } = await result.json()

    switch (errorDescription) {
      case "missing two-factor authentication code":
        return "otp_missing"
      case "missing on-demand authentication code":
        return "on_demand_otp_missing"
      case "invalid two-factor authentication code":
        return "invalid_otp"

      default:
        return "failure"
    }
  }),
  signUp: thunk(async (actions, args) => {
    const { oauthProvider, oauthMode, email, name, agreedToReceiveEmails } = args

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
        password: oauthMode === "email" ? args.password : undefined,
        oauth_token: oauthMode === "accessToken" ? args.accessToken : undefined,
        jwt: oauthMode === "jwt" ? args.jwt : undefined,
        apple_uid: oauthProvider === "apple" ? args.appleUid : undefined,
        id_token: oauthMode === "idToken" ? args.idToken : undefined,
        agreed_to_receive_emails: agreedToReceiveEmails,
        accepted_terms_of_service: true,
      },
    })

    // The user account has been successfully created
    if (result.status === 201) {
      postEventToProviders(tracks.createdAccount({ signUpMethod: oauthProvider }))

      switch (oauthMode) {
        case "accessToken":
          await actions.signIn({
            oauthProvider,
            oauthMode,
            email,
            accessToken: args.accessToken,
          })
          break
        case "jwt":
          await actions.signIn({
            oauthProvider,
            oauthMode,
            email,
            jwt: args.jwt,
          })
          break
        case "idToken":
          await actions.signIn({
            oauthProvider,
            oauthMode,
            email,
            idToken: args.idToken,
            appleUid: args.appleUid,
          })
          break
        case "email":
          await actions.signIn({
            oauthProvider,
            oauthMode,
            email,
            password: args.password,
          })
          break
        default:
          assertNever(oauthProvider)
      }

      // Setting up user prefs from gravity after successsfull registration.
      GlobalStore.actions.userPrefs.fetchRemoteUserPrefs()
      GlobalStore.actions.onboarding.setOnboardingState("incomplete")

      return { success: true, message: "" }
    }

    if (result.status === 403) {
      return {
        success: false,
        error: "blocked_attempt",
        message: "Sign up attempt blocked",
      }
    }

    const resultJson = await result.json()

    const { message, existingProviders } = handleSignUpError({
      errorObject: resultJson,
      oauthProvider,
    })

    const { accessToken } = args as SignUpParams & (FacebookOAuthParams | GoogleOAuthParams)
    const { appleUid, idToken } = args as SignUpParams & AppleOAuthParams
    return {
      success: false,
      error: resultJson?.error,
      message,
      meta: {
        existingProviders: existingProviders.length ? existingProviders : undefined,
        email,
        oauthToken: accessToken,
        appleUid,
        idToken,
        provider: oauthProvider,
      },
    }
  }),
  authFacebook: thunk(async (actions, options) => {
    // eslint-disable-next-line no-async-promise-executor
    return await new Promise<AuthPromiseResolveType>(async (resolve, reject) => {
      try {
        let loginTrackingIOS: LoginTracking | undefined
        if (Platform.OS === "ios") {
          loginTrackingIOS = "limited"
        }

        const { declinedPermissions, isCancelled } = await LoginManager.logInWithPermissions(
          ["public_profile", "email"],
          loginTrackingIOS
        )

        if (declinedPermissions?.includes("email")) {
          reject(
            new AuthError("Please allow the use of email to continue.", "Email Permission Declined")
          )
          return
        }

        if (Platform.OS === "ios") {
          handleLimitedFacebookAuth(
            actions,
            isCancelled,
            clientKey as string,
            clientSecret as string,
            options,
            resolve,
            reject
          )
        } else {
          handleClassicFacebookAuth(
            actions,
            isCancelled,
            clientKey as string,
            clientSecret as string,
            options,
            resolve,
            reject
          )
        }
      } catch (e) {
        if (e instanceof Error) {
          if (e.message === "User logged in as different Facebook user.") {
            // odd and hopefully shouldn't happen often
            // if the user has a valid session with another account
            // and tries to log in with a new account they will hit this error
            // log them out and try again
            LoginManager.logOut()
            GlobalStore.actions.auth.authFacebook(options)
          }

          reject(new AuthError("Error logging in with facebook", e.message))
          return
        }
        reject(new AuthError("Error logging in with facebook"))
        return
      }
    })
  }),
  authFacebook2: thunk(async (actions) => {
    // TODO: replace authFacebook once we are sure that authFacebook2 is working fine
    // eslint-disable-next-line no-async-promise-executor
    return await new Promise<AuthPromiseResolveType>(async (resolve, reject) => {
      try {
        let loginTrackingIOS: LoginTracking | undefined
        if (Platform.OS === "ios") {
          loginTrackingIOS = "limited"
        }

        const { declinedPermissions, isCancelled } = await LoginManager.logInWithPermissions(
          ["public_profile", "email"],
          loginTrackingIOS
        )

        if (declinedPermissions?.includes("email")) {
          reject(
            new AuthError("Please allow the use of email to continue.", "Email Permission Declined")
          )
          return
        }

        if (Platform.OS === "ios") {
          handleLimitedFacebookAuth2(
            actions,
            isCancelled,
            clientKey as string,
            clientSecret as string,
            resolve,
            reject
          )
        } else {
          handleClassicFacebookAuth2(
            actions,
            isCancelled,
            clientKey as string,
            clientSecret as string,
            resolve,
            reject
          )
        }
      } catch (e) {
        if (e instanceof Error) {
          if (e.message === "User logged in as different Facebook user.") {
            // odd and hopefully shouldn't happen often
            // if the user has a valid session with another account
            // and tries to log in with a new account they will hit this error
            // log them out and try again
            LoginManager.logOut()
            GlobalStore.actions.auth.authFacebook2()
          }

          reject(new AuthError("Error logging in with facebook", e.message))
          return
        }
        reject(new AuthError("Error logging in with facebook"))
        return
      }
    })
  }),
  authGoogle: thunk(async (actions, options) => {
    // eslint-disable-next-line no-async-promise-executor
    return await new Promise<AuthPromiseResolveType>(async (resolve, reject) => {
      try {
        if (!(await GoogleSignin.hasPlayServices())) {
          reject(new AuthError("Play services are not available."))
          return
        }
        const userInfo = await GoogleSignin.signIn()
        const accessToken = (await GoogleSignin.getTokens()).accessToken

        if (options.signInOrUp === "signUp") {
          const resultGravitySignUp = userInfo.user.name
            ? await actions.signUp({
                email: userInfo.user.email,
                name: userInfo.user.name,
                oauthMode: "accessToken",
                accessToken,
                oauthProvider: "google",
                agreedToReceiveEmails: options.agreedToReceiveEmails,
              })
            : { success: false, message: "missing name in google's userInfo" }

          if (resultGravitySignUp.success) {
            resolve({ success: true })
            return
          } else if (resultGravitySignUp.error === "blocked_attempt") {
            reject(new AuthError("Attempt blocked"))
          } else {
            reject(
              new AuthError(
                resultGravitySignUp.message,
                resultGravitySignUp.error,
                resultGravitySignUp.meta
              )
            )
            return
          }
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
              client_id: clientKey,
              client_secret: clientSecret,
              grant_type: "oauth_token",
              scope: "offline_access",
            },
          })

          if (resultGravityAccessToken.status === 201) {
            const { access_token: userAccessToken } = await resultGravityAccessToken.json() // here's the X-ACCESS-TOKEN we needed now we can get user's email and sign in
            const { email } = await actions.getUser({ accessToken: userAccessToken })

            const resultGravitySignIn = await actions.signIn({
              oauthProvider: "google",
              oauthMode: "accessToken",
              email,
              accessToken,
              onSignIn: options.onSignIn,
            })

            if (resultGravitySignIn) {
              resolve({ success: true })
              return
            } else {
              reject(new AuthError("Could not log in"))
              return
            }
          } else {
            if (resultGravityAccessToken.status === 403) {
              reject(new AuthError("Attempt blocked"))
            } else {
              const res = await resultGravityAccessToken.json()
              showError(res, reject, "google")
            }
          }
        }
      } catch (e: any) {
        if (statusCodes.SIGN_IN_CANCELLED === e?.code) {
          reject(new AuthError(statusCodes.SIGN_IN_CANCELLED))
          return
        }

        if (e instanceof Error) {
          if (e?.message === "DEVELOPER_ERROR") {
            reject(
              new AuthError(
                "Google auth does not work in firebase beta, try again in a playstore beta",
                e?.message
              )
            )
            return
          }

          reject(new AuthError("Error logging in with google", e?.message))
          return
        }
        reject(new AuthError("Error logging in with google"))
        return
      }
    })
  }),
  authGoogle2: thunk(async (actions) => {
    // TODO: replace authGoogle once we are sure that authGoogle2 is working fine
    // eslint-disable-next-line no-async-promise-executor
    return await new Promise<AuthPromiseResolveType>(async (resolve, reject) => {
      try {
        if (!(await GoogleSignin.hasPlayServices())) {
          reject(new AuthError("Play services are not available."))
          return
        }
        const userInfo = await GoogleSignin.signIn()
        const accessToken = (await GoogleSignin.getTokens()).accessToken

        const resultGravitySignUp = userInfo.user.name
          ? await actions.signUp({
              email: userInfo.user.email,
              name: userInfo.user.name,
              oauthMode: "accessToken",
              accessToken,
              oauthProvider: "google",
              agreedToReceiveEmails: true,
            })
          : { success: false, message: "missing name in google's userInfo" }

        if (resultGravitySignUp.success) {
          resolve({ success: true })
          return
        }

        if (resultGravitySignUp.error === "blocked_attempt") {
          reject(new AuthError("Attempt blocked"))
          return
        }

        if (resultGravitySignUp.error !== "Another Account Already Linked") {
          reject(
            new AuthError(
              resultGravitySignUp.message,
              resultGravitySignUp.error,
              resultGravitySignUp.meta
            )
          )
          return
        }

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
            client_id: clientKey,
            client_secret: clientSecret,
            grant_type: "oauth_token",
            scope: "offline_access",
          },
        })

        if (resultGravityAccessToken.status === 201) {
          const { access_token: userAccessToken } = await resultGravityAccessToken.json() // here's the X-ACCESS-TOKEN we needed now we can get user's email and sign in
          const { email } = await actions.getUser({ accessToken: userAccessToken })

          const resultGravitySignIn = await actions.signIn({
            oauthProvider: "google",
            oauthMode: "accessToken",
            email,
            accessToken,
          })

          if (resultGravitySignIn) {
            resolve({ success: true })
            return
          } else {
            reject(new AuthError("Could not log in"))
            return
          }
        } else {
          if (resultGravityAccessToken.status === 403) {
            reject(new AuthError("Attempt blocked"))
          } else {
            const res = await resultGravityAccessToken.json()
            showError(res, reject, "google")
          }
        }
      } catch (e: any) {
        if (statusCodes.SIGN_IN_CANCELLED === e?.code) {
          reject(new AuthError(statusCodes.SIGN_IN_CANCELLED))
          return
        }

        if (e instanceof Error) {
          if (e?.message === "DEVELOPER_ERROR") {
            reject(
              new AuthError(
                "Google auth does not work in firebase beta, try again in a playstore beta",
                e?.message
              )
            )
            return
          }

          reject(new AuthError("Error logging in with google", e?.message))
          return
        }
        reject(new AuthError("Error logging in with google"))
        return
      }
    })
  }),
  authApple: thunk(async (actions, { agreedToReceiveEmails, onSignIn }) => {
    // eslint-disable-next-line no-async-promise-executor
    return await new Promise<AuthPromiseResolveType>(async (resolve, reject) => {
      // we cannot have separated logic for sign in and sign up with apple, as with google or facebook,
      // because apple returns email only on the FIRST auth attempt, so we run sign up and sign in one by one
      let signInOrUp: "signIn" | "signUp" = "signUp"

      const userInfo = await appleAuth
        .performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        })
        .catch(() => {
          // Use canceled apple auth
          actions.setSessionState({ isLoading: false })
        })

      if (!userInfo) {
        return
      }
      const idToken = userInfo.identityToken
      if (!idToken) {
        reject(new AuthError("Failed to authenticate using apple sign in"))
        return
      }
      const appleUid = userInfo.user

      if (signInOrUp === "signUp") {
        const firstName = userInfo.fullName?.givenName ? userInfo.fullName.givenName : ""
        const lastName = userInfo.fullName?.familyName ? userInfo.fullName.familyName : ""

        const resultGravitySignUp = userInfo.email
          ? await actions.signUp({
              email: userInfo.email,
              name: `${firstName} ${lastName}`.trim(),
              oauthMode: "idToken",
              appleUid,
              idToken,
              oauthProvider: "apple",
              agreedToReceiveEmails: !!agreedToReceiveEmails,
            })
          : {
              success: false,
              error: "Apple UserInfo Email Is Null",
              message: "missing email in apple's userInfo",
            }

        if (resultGravitySignUp.success) {
          resolve(resultGravitySignUp)
          return
        }
        const shouldSignIn =
          resultGravitySignUp.error === "Another Account Already Linked" ||
          // because userinfo.email is returned only the first time
          resultGravitySignUp.error === "Apple UserInfo Email Is Null"

        if (shouldSignIn) {
          signInOrUp = "signIn"
        } else {
          reject(
            new AuthError(
              resultGravitySignUp.message,
              resultGravitySignUp.error,
              resultGravitySignUp.meta
            )
          )
          return
        }
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
            apple_uid: appleUid,
            id_token: idToken,
            client_id: clientKey,
            client_secret: clientSecret,
            grant_type: "apple_uid",
            scope: "offline_access",
          },
        })

        if (resultGravityAccessToken.status === 201) {
          const { access_token: userAccessToken } = await resultGravityAccessToken.json() // here's the X-ACCESS-TOKEN we needed now we can get user's email and sign in
          const { email } = await actions.getUser({ accessToken: userAccessToken })

          const resultGravitySignIn = await actions.signIn({
            oauthProvider: "apple",
            oauthMode: "idToken",
            email,
            appleUid,
            idToken,
            onSignIn,
          })

          if (resultGravitySignIn) {
            resolve({ success: true })
            return
          } else {
            reject(new AuthError("Could not log in"))
            return
          }
        } else {
          if (resultGravityAccessToken.status === 403) {
            reject(new AuthError("Attempt blocked"))
          } else {
            const res = await resultGravityAccessToken.json()
            showError(res, reject, "apple")
          }
        }
      }
    })
  }),
  identifyUser: action((state) => {
    const { userID: userId } = state

    if (userId) {
      Sentry.setUser({ id: userId })
      Braze.changeUser(userId)
      SiftReactNative.setUserId(userId)
      // This is here becuase Sift's RN wrapper does not currently automatically collect or
      // upload events for Android devices. If they update the package, we can remove it.
      SiftReactNative.upload()
      SegmentTrackingProvider.identify?.(userId, { is_temporary_user: 0 })
    }

    state.sessionState.isUserIdentified = true
  }),

  signOut: thunk(async (actions, _) => {
    const signOutGoogle = async () => {
      try {
        const isSignedIn = await GoogleSignin.isSignedIn()
        if (isSignedIn) {
          await GoogleSignin.revokeAccess()
          await GoogleSignin.signOut()
        }
      } catch (error) {
        console.log("Failed to signout from Google")
        console.error(error)
      }
    }

    GlobalStore.actions.artsyPrefs.pushPromptLogic.setPushPermissionsRequestedThisSession(false)
    SiftReactNative.unsetUserId()
    SegmentTrackingProvider.identify?.(undefined, { is_temporary_user: 1 })

    await Promise.all([
      Platform.OS === "ios"
        ? await LegacyNativeModules.ArtsyNativeModule.clearUserData()
        : Promise.resolve(),
      __DEV__ && (await clearNavState()),
      await signOutGoogle(),
      LoginManager.logOut(),
      await AsyncStorage.clear(),
      CookieManager.clearAll(),
      _globalCacheRef?.clear(),
      actions.setSessionState({ isUserIdentified: true }),
    ])
  }),
  verifyUser: thunk(async (actions, { email, recaptchaToken }) => {
    let result: Response

    try {
      result = await actions.gravityUnauthenticatedRequest({
        path: `/api/v1/user/identify`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          email,
          recaptcha_token: recaptchaToken,
        },
      })
    } catch (error) {
      Sentry.captureMessage(`AuthModel verifyUser error ${error}`)
      return "something_went_wrong"
    }

    if (result.status !== 201) {
      Sentry.captureMessage(`AuthModel verifyUser result status ${result.status}`)
      return "something_went_wrong"
    }

    const { exists } = await result.json()

    if (exists) {
      return "user_exists"
    } else {
      return "user_does_not_exist"
    }
  }),
})

const isTokenExpired = (expiresIn: string, bufferMs = 300_000) => {
  const expirationTime = new Date(expiresIn).getTime()

  if (isNaN(expirationTime)) {
    // if expiresIn is not a valid date string, treat it as expired
    return true
  }

  // check if the token is expired, considering a buffer to account for clock skew or delays
  return Date.now() >= expirationTime - bufferMs
}

const tracks = {
  createdAccount: ({ signUpMethod }: { signUpMethod: AuthService }): Partial<CreatedAccount> => ({
    action: ActionType.createdAccount,
    service: signUpMethod,
  }),
  loggedIn: (service: AuthService) => ({
    action: ActionType.successfullyLoggedIn,
    service,
  }),
  resetYourPassword: (): Partial<ResetYourPassword> => ({
    action: ActionType.resetYourPassword,
    trigger: "tap",
  }),
}
