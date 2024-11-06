import { statusCodes } from "@react-native-google-signin/google-signin"
import { captureMessage } from "@sentry/react-native"
import { OnboardingNavigationStack } from "app/Scenes/Onboarding/Onboarding"
import { AppleToken, GoogleOrFacebookToken } from "app/Scenes/Onboarding/OnboardingSocialLink"
import { AuthPromiseRejectType, AuthPromiseResolveType } from "app/store/AuthModel"
import { GlobalStore } from "app/store/GlobalStore"
import { showBlockedAuthError } from "app/utils/auth/authHelpers"
import { capitalize } from "lodash"
import { Alert, InteractionManager } from "react-native"

export const handleSocialLogin = async (callback: () => Promise<AuthPromiseResolveType>) => {
  GlobalStore.actions.auth.setSessionState({ isLoading: true })
  InteractionManager.runAfterInteractions(() => {
    callback().catch((error: AuthPromiseRejectType) => {
      InteractionManager.runAfterInteractions(() => {
        GlobalStore.actions.auth.setSessionState({ isLoading: false })
        InteractionManager.runAfterInteractions(() => {
          handleError(error)
        })
      })
    })
  })
}

const handleError = (error: AuthPromiseRejectType) => {
  if (error.message === statusCodes.SIGN_IN_CANCELLED) {
    return
  } else {
    captureMessage("AUTH_FAILURE: " + error.message)

    const canBeLinked =
      error.error === "User Already Exists" && error.meta && error.meta.existingProviders
    if (canBeLinked) {
      handleErrorWithAlternativeProviders(error.meta)
      return
    }
    GlobalStore.actions.auth.setSessionState({ isLoading: false })

    InteractionManager.runAfterInteractions(() => {
      const errorMode = error.message === "Attempt blocked" ? "attempt blocked" : "no account"
      showErrorAlert(errorMode, error)
      return
    })
  }
}

const handleErrorWithAlternativeProviders = (meta: AuthPromiseRejectType["meta"]) => {
  if (!meta) {
    return
  }

  const titleizedProvider = capitalize(meta.provider)

  const {
    email,
    name,
    existingProviders: providers,
    provider: providerToBeLinked,
    oauthToken,
    idToken,
    appleUid,
  } = meta

  const navParams: Omit<
    OnboardingNavigationStack["OnboardingSocialLink"],
    "tokenForProviderToBeLinked"
  > = {
    email,
    name: name ?? "",
    providers: providers ?? [],
    providerToBeLinked,
  }

  let tokenForProviderToBeLinked: GoogleOrFacebookToken | AppleToken

  if (["google", "facebook"].includes(providerToBeLinked)) {
    if (!oauthToken) {
      console.warn(`Error: No oauthToken provided for ${titleizedProvider}`)
      return
    }
    tokenForProviderToBeLinked = oauthToken

    console.log({ navParams, tokenForProviderToBeLinked })

    // TODO:
    // navigation.navigate("OnboardingSocialLink", {
    //   ...navParams,
    //   tokenForProviderToBeLinked,
    // })
  } else if (providerToBeLinked === "apple") {
    if (!idToken || !appleUid) {
      console.warn(`Error: idToken and appleUid must be provided for ${titleizedProvider}`)
      return
    }
    tokenForProviderToBeLinked = { idToken, appleUid }

    console.log({ navParams, tokenForProviderToBeLinked })

    // TODO:
    // navigation.navigate("OnboardingSocialLink", {
    //   ...navParams,
    //   tokenForProviderToBeLinked,
    // })
  }
}

const showErrorAlert = (
  errorMode: "no account" | "attempt blocked",
  error: AuthPromiseRejectType
) => {
  if (errorMode === "no account") {
    Alert.alert("No Artsy account found", error.message, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          // @ts-expect-error
          navigation.replace(mode === "login" ? "OnboardingCreateAccount" : "OnboardingLogin", {
            withFadeAnimation: true,
          })
        },
      },
    ])
  } else {
    showBlockedAuthError("social sign in")
  }
}
