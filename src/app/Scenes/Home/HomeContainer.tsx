import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"
import { HomeQueryRenderer } from "app/Scenes/Home/Home"
import { HomeViewScreen } from "app/Scenes/HomeView/HomeView"
import { Playground } from "app/Scenes/Playground/Playground"
import { GlobalStore } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
// import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useEffect } from "react"

export const HomeContainer = () => {
  const artQuizState = GlobalStore.useAppState((state) => state.auth.onboardingArtQuizState)
  const isNavigationReady = GlobalStore.useAppState((state) => state.sessionState.isNavigationReady)
  const showPlayground = useDevToggle("DTShowPlayground")

  const preferLegacyHomeScreen = true // useFeatureFlag("ARPreferLegacyHomeScreen")

  const shouldDisplayNewHomeView = ArtsyNativeModule.isBetaOrDev && !preferLegacyHomeScreen

  const navigateToArtQuiz = async () => {
    await navigate("/art-quiz")
  }

  useEffect(() => {
    if (artQuizState === "incomplete" && isNavigationReady) {
      navigateToArtQuiz()
      return
    }
  }, [artQuizState, navigateToArtQuiz, isNavigationReady])

  if (artQuizState === "incomplete") {
    return null
  }

  if (showPlayground) {
    return <Playground />
  }

  if (shouldDisplayNewHomeView) {
    return <HomeViewScreen />
  } else {
    return <HomeQueryRenderer />
  }
}
