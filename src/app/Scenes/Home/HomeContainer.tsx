import { ArtQuiz } from "app/Scenes/ArtQuiz/ArtQuiz"
import { HomeQueryRenderer } from "app/Scenes/Home/Home"
import { GlobalStore } from "app/store/GlobalStore"

export const HomeContainer = () => {
  const artQuizState = GlobalStore.useAppState((state) => state.auth.artQuizState)

  console.log({ artQuizState })

  if (artQuizState === "open") {
    return <ArtQuiz />
  }

  return <HomeQueryRenderer />
}
