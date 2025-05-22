import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native"
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import { ArtQuizNavigationQuery } from "__generated__/ArtQuizNavigationQuery.graphql"
import { ArtQuizArtworks } from "app/Scenes/ArtQuiz/ArtQuizArtworks"
import { ArtQuizLoader } from "app/Scenes/ArtQuiz/ArtQuizLoader"
import { ArtQuizWelcome } from "app/Scenes/ArtQuiz/ArtQuizWelcome"
import { navigate } from "app/system/navigation/navigate"
import { Suspense, useEffect } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

export type ArtQuizNavigationStack = {
  ArtQuizWelcome: undefined
  ArtQuizArtworks: undefined
}

export const StackNavigator = createStackNavigator<ArtQuizNavigationStack>()

const ArtQuizScreen: React.FC = () => {
  const queryResult = useLazyLoadQuery<ArtQuizNavigationQuery>(ArtQuizScreenQuery, {}).me?.quiz
  const isQuizCompleted = !!queryResult?.completedAt

  useEffect(() => {
    if (isQuizCompleted) {
      navigate("/art-quiz/results")
    }
  }, [isQuizCompleted])

  return (
    <NavigationIndependentTree>
      <NavigationContainer>
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
        </StackNavigator.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  )
}

export const ArtQuiz = () => {
  return (
    <Suspense fallback={<ArtQuizLoader />}>
      <ArtQuizScreen />
    </Suspense>
  )
}

export const ArtQuizScreenQuery = graphql`
  query ArtQuizNavigationQuery {
    me {
      quiz {
        completedAt
      }
    }
  }
`
