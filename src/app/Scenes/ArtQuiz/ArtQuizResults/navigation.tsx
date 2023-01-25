import { StackNavigator } from "app/Scenes/ArtQuiz/ArtQuiz"
import { ArtQuizResultLoader } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultLoader"
import { ArtQuizResults } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResults"

export type ArtQuizResultsNavigationScreens = {
  ArtQuizResultLoader: undefined
  ArtQuizResults: undefined
}

export const ArtQuizResultsNavigation = () => {
  return (
    <StackNavigator.Group>
      <StackNavigator.Screen name="ArtQuizResultLoader" component={ArtQuizResultLoader} />
      <StackNavigator.Screen name="ArtQuizResults" component={ArtQuizResults} />
    </StackNavigator.Group>
  )
}
