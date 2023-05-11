import { HomeQueryRenderer } from "app/Scenes/Home/Home"
import { GlobalStore } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { requestPushNotificationsPermission } from "app/utils/PushNotification"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useEffect } from "react"

export const HomeContainer = () => {
  const artQuizState = GlobalStore.useAppState((state) => state.auth.onboardingArtQuizState)
  const onboardingState = GlobalStore.useAppState((state) => state.auth.onboardingState)
  const hasRequestedPermissionsThisSession = GlobalStore.useAppState(
    (state) => state.auth.requestedPushPermissionsThisSession
  )

  const isNavigationReady = GlobalStore.useAppState((state) => state.sessionState.isNavigationReady)

  const shouldShowArtQuiz = useFeatureFlag("ARShowArtQuizApp")

  const navigateToArtQuiz = async () => {
    await navigate("/art-quiz")
  }

  useEffect(() => {
    if (shouldShowArtQuiz && artQuizState === "incomplete" && isNavigationReady) {
      navigateToArtQuiz()
      return
    }

    if (
      !hasRequestedPermissionsThisSession &&
      (!onboardingState || onboardingState === "complete" || onboardingState === "none")
    ) {
      requestPushNotificationsPermission()
      GlobalStore.actions.auth.setState({ requestedPushPermissionsThisSession: true })
    }
  }, [shouldShowArtQuiz, artQuizState, navigateToArtQuiz, isNavigationReady])

  if (shouldShowArtQuiz && artQuizState === "incomplete") {
    return null
  }

  return <HomeQueryRenderer />
}
