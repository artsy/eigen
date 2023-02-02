import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import { ArtQuizNavigationQuery } from "__generated__/ArtQuizNavigationQuery.graphql"
import { ArtQuizArtworks } from "app/Scenes/ArtQuiz/ArtQuizArtworks"
import { ArtQuizResults } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResults"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtQuizWelcome } from "./ArtQuizWelcome"

export type ArtQuizNavigationStack = {
  ArtQuizWelcome: undefined
  ArtQuizArtworks: undefined
  ArtQuizResults: undefined
}

export const StackNavigator = createStackNavigator<ArtQuizNavigationStack>()

export const ArtQuizNavigation: React.FC = () => {
  const quizCompleted = useLazyLoadQuery<ArtQuizNavigationQuery>(artQuizNavigationQuery, {}).me
    ?.quiz.completedAt

  if (quizCompleted) {
    return <ArtQuizResults />
  }

  return (
    <NavigationContainer independent>
      <StackNavigator.Navigator
        screenOptions={{
          ...TransitionPresets.DefaultTransition,
          headerShown: false,
          headerMode: "screen",
          gestureEnabled: false,
        }}
      >
        <StackNavigator.Screen name="ArtQuizWelcome" component={ArtQuizWelcome} />
        <StackNavigator.Screen name="ArtQuizArtworks" component={ArtQuizArtworks} />
        <StackNavigator.Screen name="ArtQuizResults" component={ArtQuizResults} />
      </StackNavigator.Navigator>
    </NavigationContainer>
  )
}

const artQuizNavigationQuery = graphql`
  query ArtQuizNavigationQuery {
    me {
      quiz {
        completedAt
      }
    }
  }
`
