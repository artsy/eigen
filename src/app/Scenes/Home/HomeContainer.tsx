import { HomeQueryRenderer } from "app/Scenes/Home/Home"
import { GlobalStore } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"

export const HomeContainer = () => {
  const artQuizState = GlobalStore.useAppState((state) => state.auth.onboardingArtQuizState)

  const navigateToArtQuiz = async () => {
    await navigate("/art-quiz")
  }

  if (artQuizState === "incomplete") {
    navigateToArtQuiz()
    return null
  }

  return <HomeQueryRenderer />
}
