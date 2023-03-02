import { createStackNavigator } from "@react-navigation/stack"
import { ArtQuizNavigationQuery } from "__generated__/ArtQuizNavigationQuery.graphql"
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
  const queryResult = useLazyLoadQuery<ArtQuizNavigationQuery>(artQuizNavigationQuery, {}).me?.quiz
  const isQuizCompleted = !!queryResult?.completedAt

  useEffect(() => {
    if (isQuizCompleted) {
      navigate("/art-quiz/results")
    }
  }, [isQuizCompleted])

  return <ArtQuizWelcome />
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
        quizArtworkConnection(first: 16) {
          edges {
            interactedAt
          }
        }
      }
    }
  }
`
