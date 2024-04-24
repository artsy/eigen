import * as Sentry from "@sentry/react-native"
import { AuthError } from "app/store/AuthError"
import { AuthModel, AuthPromiseResolveType, OAuthProvider } from "app/store/AuthModel"
import "core-js/stable/atob"
import { Actions } from "easy-peasy"
import { jwtDecode } from "jwt-decode"
import { capitalize } from "lodash"
import { Alert } from "react-native"
import {
  AccessToken,
  AuthenticationToken,
  GraphRequest,
  GraphRequestManager,
} from "react-native-fbsdk-next"

export const showError = (
  res: any,
  reject: (reason?: any) => void,
  provider: "facebook" | "apple" | "google"
) => {
  const providerName = capitalize(provider)

  if (res.error_description) {
    if (res.error_description.includes("no account linked to oauth token")) {
      const message =
        `Your ${providerName} account is not linked to any Artsy account. ` +
        `If you already have an Artsy account and you want to log in to it via ${providerName}, ` +
        `you will first need to sign up with ${providerName}. ` +
        `You will then have the option to link the two accounts.
        `
      Sentry.captureMessage("AUTH_FAILURE: " + message)
      reject(new AuthError(message))
      return
    } else {
      const message = "Login attempt failed"
      Sentry.captureMessage("AUTH_FAILURE: " + message)
      reject(new AuthError(message))
      return
    }
  }
}

export const showBlockedAuthError = (mode: "sign in" | "sign up") => {
  const messagePrefix = mode === "sign in" ? "Sign in" : "Sign up"
  const innerMessage = mode === "sign in" ? "signing in" : "signing up"
  Alert.alert(
    messagePrefix + " attempt blocked",
    "Please try " +
      innerMessage +
      " from a different internet connection or contact support@artsy.net for help.",
    [
      {
        text: "OK",
        onPress: () => {
          Sentry.captureMessage("AUTH_BLOCKED: " + messagePrefix + " unauthorized reported")
        },
      },
    ]
  )
}

export const handleSignUpError = ({
  errorObject,
  oauthProvider,
}: {
  errorObject: any
  oauthProvider: OAuthProvider
}) => {
  let message = ""
  let existingProviders: OAuthProvider[] = []
  const providerName = capitalize(oauthProvider)

  if (errorObject?.error === "User Already Exists") {
    message = `Your ${
      oauthProvider === "email" ? "" : providerName + " "
    }email account is linked to an Artsy user account. Please log in using your email and password instead.`
    const authentications = (errorObject?.providers ?? []) as string[]
    if (errorObject?.has_password && oauthProvider !== "email") {
      existingProviders = ["email"]
    }
    existingProviders = [
      ...existingProviders,
      ...(authentications.map((p) => p.toLowerCase()) as OAuthProvider[]),
    ]
  } else if (errorObject?.error === "Another Account Already Linked") {
    message =
      `Your ${providerName} account is already linked to another Artsy account. ` +
      `Try logging in with ${providerName}.`
  } else if (errorObject.message && errorObject.message.match("Unauthorized source IP address")) {
    message = `You could not create an account because your IP address was blocked by ${providerName}`
  } else {
    message = "Failed to sign up"
  }

  Sentry.captureMessage("AUTH_SIGN_UP_FAILURE: " + message)

  return {
    message,
    existingProviders,
  }
}

export async function handleFacebookClassicSignUp(
  actions: Actions<AuthModel>,
  userDetails: { email: string; name: string },
  accessToken: string,
  options: { agreedToReceiveEmails: boolean },
  resolve: (value: AuthPromiseResolveType | PromiseLike<AuthPromiseResolveType>) => void,
  reject: (reason?: any) => void
) {
  try {
    const resultGravitySignUp = await actions.signUp({
      email: userDetails.email,
      name: userDetails.name,
      accessToken: accessToken,
      oauthProvider: "facebook",
      oauthMode: "accessToken",
      agreedToReceiveEmails: options.agreedToReceiveEmails,
    })

    if (resultGravitySignUp.success) {
      resolve({ success: true })
    } else if (resultGravitySignUp.error === "blocked_attempt") {
      throw new AuthError("Attempt blocked")
    } else {
      throw new AuthError(
        resultGravitySignUp.message,
        resultGravitySignUp.error,
        resultGravitySignUp.meta
      )
    }
  } catch (error) {
    reject(error)
  }
}

export async function handleFacebookLimitedSignUp(
  actions: Actions<AuthModel>,
  userDetails: { email: string; name: string },
  jwt: string,
  options: { agreedToReceiveEmails: boolean },
  resolve: (value: AuthPromiseResolveType | PromiseLike<AuthPromiseResolveType>) => void,
  reject: (reason?: any) => void
) {
  try {
    const resultGravitySignUp = await actions.signUp({
      email: userDetails.email,
      name: userDetails.name,
      jwt: jwt,
      oauthProvider: "facebook",
      oauthMode: "jwt",
      agreedToReceiveEmails: options.agreedToReceiveEmails,
    })

    if (resultGravitySignUp.success) {
      resolve({ success: true })
    } else if (resultGravitySignUp.error === "blocked_attempt") {
      throw new AuthError("Attempt blocked")
    } else {
      throw new AuthError(
        resultGravitySignUp.message,
        resultGravitySignUp.error,
        resultGravitySignUp.meta
      )
    }
  } catch (error) {
    reject(error)
  }
}

export async function handleFacebookClassicSignIn(
  actions: Actions<AuthModel>,
  accessToken: string,
  clientId: string,
  clientSecret: string,
  options: {
    onSignIn?: () => void
    signInOrUp: "signIn" | "signUp"
  },
  resolve: (value: AuthPromiseResolveType | PromiseLike<AuthPromiseResolveType>) => void,
  reject: (reason?: any) => void
) {
  try {
    const resultGravityAccessToken = await actions.gravityUnauthenticatedRequest({
      path: `/oauth2/access_token`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        oauth_provider: "facebook",
        oauth_token: accessToken,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "oauth_token",
        scope: "offline_access",
      },
    })

    if (resultGravityAccessToken.status === 201) {
      const { access_token: userAccessToken } = await resultGravityAccessToken.json()
      const { email } = await actions.getUser({ accessToken: userAccessToken })

      const resultGravitySignIn = await actions.signIn({
        oauthProvider: "facebook",
        oauthMode: "accessToken",
        email,
        accessToken: accessToken,
        onSignIn: options.onSignIn,
      })

      if (resultGravitySignIn) {
        resolve({ success: true })
      } else {
        throw new AuthError("Could not log in")
      }
    } else {
      if (resultGravityAccessToken.status === 403) {
        throw new AuthError("Attempt blocked")
      } else {
        const res = await resultGravityAccessToken.json()
        showError(res, reject, "facebook")
      }
    }
  } catch (error) {
    reject(error)
  }
}

export async function handleFacebookLimitedSignIn(
  actions: Actions<AuthModel>,
  jwtToken: string,
  clientId: string,
  clientSecret: string,
  options: {
    onSignIn?: () => void
    signInOrUp: "signIn" | "signUp"
  },
  resolve: (value: AuthPromiseResolveType | PromiseLike<AuthPromiseResolveType>) => void,
  reject: (reason?: any) => void
) {
  try {
    const resultGravityAccessToken = await actions.gravityUnauthenticatedRequest({
      path: `/oauth2/access_token`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        oauth_provider: "facebook",
        jwt: jwtToken,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "jwt",
        scope: "offline_access",
      },
    })

    if (resultGravityAccessToken.status === 201) {
      const { access_token: userAccessToken } = await resultGravityAccessToken.json()
      const { email } = await actions.getUser({ accessToken: userAccessToken })

      const resultGravitySignIn = await actions.signIn({
        oauthProvider: "facebook",
        oauthMode: "jwt",
        email,
        jwt: jwtToken,
        onSignIn: options.onSignIn,
      })

      if (resultGravitySignIn) {
        resolve({ success: true })
      } else {
        throw new AuthError("Could not log in")
      }
    } else {
      if (resultGravityAccessToken.status === 403) {
        throw new AuthError("Attempt blocked")
      } else {
        const res = await resultGravityAccessToken.json()
        showError(res, reject, "facebook")
      }
    }
  } catch (error) {
    reject(error)
  }
}

export async function handleClassicFacebookAuth(
  actions: Actions<AuthModel>,
  isCancelled: boolean,
  clientId: string,
  clientSecret: string,
  options:
    | {
        signInOrUp: "signIn"
        onSignIn?: (() => void) | undefined
      }
    | {
        signInOrUp: "signUp"
        agreedToReceiveEmails: boolean
      },
  resolve: (value: AuthPromiseResolveType | PromiseLike<AuthPromiseResolveType>) => void,
  reject: (reason?: any) => void
) {
  try {
    const accessToken = !isCancelled && (await AccessToken.getCurrentAccessToken())

    if (!accessToken) {
      reject(new AuthError("Could not log in"))
      return
    }

    const responseFacebookInfoCallback = async (error: any | null, result: any | null) => {
      if (error) {
        reject(new AuthError("Error fetching Facebook data", error))
        return
      }

      if (!result || !result.email) {
        reject(
          new AuthError(
            "There is no email associated with your Facebook account. Please log in using your email and password instead."
          )
        )
        return
      }

      if (options.signInOrUp === "signUp") {
        handleFacebookClassicSignUp(
          actions,
          { email: result.email as string, name: result.name as string },
          accessToken.accessToken,
          options,
          resolve,
          reject
        )
      } else if (options.signInOrUp === "signIn") {
        handleFacebookClassicSignIn(
          actions,
          accessToken.accessToken,
          clientId,
          clientSecret,
          options,
          resolve,
          reject
        )
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
  } catch (error) {
    if (error instanceof Error) {
      reject(new AuthError("Error logging in with facebook", error.message))
      return
    }
    reject(new AuthError("Error logging in with facebook"))
    return
  }
}

export async function handleLimitedFacebookAuth(
  actions: Actions<AuthModel>,
  isCancelled: boolean,
  clientId: string,
  clientSecret: string,
  options:
    | {
        signInOrUp: "signIn"
        onSignIn?: (() => void) | undefined
      }
    | {
        signInOrUp: "signUp"
        agreedToReceiveEmails: boolean
      },
  resolve: (value: AuthPromiseResolveType | PromiseLike<AuthPromiseResolveType>) => void,
  reject: (reason?: any) => void
) {
  try {
    // Check if the login operation was cancelled
    if (isCancelled) {
      reject(new AuthError("Login was cancelled by the user"))
      return
    }

    const limitedLoginJWTToken = await AuthenticationToken.getAuthenticationTokenIOS()

    if (!limitedLoginJWTToken || limitedLoginJWTToken == null) {
      reject(new AuthError("Could not log in"))
      return
    }

    const decodedToken = jwtDecode(limitedLoginJWTToken.authenticationToken)

    if (!decodedToken) {
      reject(new AuthError("Invalid JWT token"))
      return
    }

    const { email, name } = decodedToken as {
      email: string
      name: string
    }

    if (options.signInOrUp === "signUp") {
      handleFacebookLimitedSignUp(
        actions,
        { email: email as string, name: name as string },
        limitedLoginJWTToken.authenticationToken,
        options,
        resolve,
        reject
      )
    } else if (options.signInOrUp === "signIn") {
      handleFacebookLimitedSignIn(
        actions,
        limitedLoginJWTToken.authenticationToken,
        clientId,
        clientSecret,
        options,
        resolve,
        reject
      )
    }
  } catch (error) {
    if (error instanceof Error) {
      reject(new AuthError("Error preparing for limited Facebook login", error.message))
    } else {
      reject(new AuthError("An unexpected error occurred in limited Facebook login"))
    }
  }
}
