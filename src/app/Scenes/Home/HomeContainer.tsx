import { HomeQueryRenderer } from "app/Scenes/Home/Home"
import { GlobalStore, useFeatureFlag } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { requestPushNotificationsPermission } from "app/utils/PushNotification"

export const HomeContainer = () => {
  const artQuizState = GlobalStore.useAppState((state) => state.auth.onboardingArtQuizState)
  const onboardingState = GlobalStore.useAppState((state) => state.auth.onboardingState)

  const shouldShowArtQuiz = useFeatureFlag("ARShowArtQuizApp")

  const navigateToArtQuiz = async () => {
    await navigate("/art-quiz")
  }

  if (shouldShowArtQuiz && artQuizState === "incomplete") {
    navigateToArtQuiz()
    return null
  }

  if (!onboardingState || onboardingState === "complete" || onboardingState === "none") {
    requestPushNotificationsPermission()
  }

  return <HomeQueryRenderer />
}
