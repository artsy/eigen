import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import { ArtQuizNavigationQuery } from "__generated__/ArtQuizNavigationQuery.graphql"
import { ArtQuizArtworks } from "app/Scenes/ArtQuiz/ArtQuizArtworks"
import { ArtQuizLoader } from "app/Scenes/ArtQuiz/ArtQuizLoader"
import { ArtQuizWelcome } from "app/Scenes/ArtQuiz/ArtQuizWelcome"
import { routingInstrumentation } from "app/system/errorReporting/sentrySetup"
import { navigate } from "app/system/navigation/navigate"
import { Suspense, useEffect, useRef } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

export type ArtQuizNavigationStack = {
  ArtQuizWelcome: undefined
  ArtQuizArtworks: undefined
}

export const StackNavigator = createStackNavigator<ArtQuizNavigationStack>()

const ArtQuizScreen: React.FC = () => {
  const queryResult = useLazyLoadQuery<ArtQuizNavigationQuery>(artQuizNavigationQuery, {}).me?.quiz
  const isQuizCompleted = !!queryResult?.completedAt

  useEffect(() => {
    if (isQuizCompleted) {
      navigate("/art-quiz/results")
    }
  }, [isQuizCompleted])

  const navContainerRef = useRef(null)

  return (
    <NavigationContainer
      independent
      onReady={() => {
        routingInstrumentation.registerNavigationContainer(navContainerRef)
      }}
      ref={navContainerRef}
    >
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
  )
}

export const ArtQuiz = () => {
  return (
    <Suspense fallback={<ArtQuizLoader />}>
      <ArtQuizScreen />
    </Suspense>
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
