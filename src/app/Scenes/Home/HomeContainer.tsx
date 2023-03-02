import { HomeQueryRenderer } from "app/Scenes/Home/Home"
import { GlobalStore, useFeatureFlag } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"

export const HomeContainer = () => {
  const artQuizState = GlobalStore.useAppState((state) => state.auth.onboardingArtQuizState)

  const shouldShowArtQuiz = useFeatureFlag("ARShowArtQuizApp")

  const navigateToArtQuiz = async () => {
    await navigate("/art-quiz")
  }

  if (artQuizState === "incomplete" && shouldShowArtQuiz) {
    navigateToArtQuiz()
    return null
  }

  return <HomeQueryRenderer />
}
