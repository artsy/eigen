import { NavigationProp, useNavigation } from "@react-navigation/native"
import { ArtQuizResultLoaderQuery } from "__generated__/ArtQuizResultLoaderQuery.graphql"
import { ArtQuizNavigationStack } from "app/Scenes/ArtQuiz/ArtQuiz"
import { Flex, Screen, Spinner, Text } from "palette"
import { Suspense, useEffect } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

const ResultsScreen = () => {
  const { navigate } = useNavigation<NavigationProp<ArtQuizNavigationStack>>()
  const queryResult = useLazyLoadQuery<ArtQuizResultLoaderQuery>(artQuizResultLoaderQuery, {})

  const savedQuizArtworksCount = queryResult.me?.quiz.savedArtworks.length ?? 0
  const hasSavedArtworks = savedQuizArtworksCount > 0

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("ArtQuizResults")
    }, 1000)
    return () => clearTimeout(timer)
  }, [navigate, hasSavedArtworks])

  return (
    <Screen>
      <Screen.Body>
        <Flex flex={1} justifyContent="center" alignItems="center" textAlign="center">
          <Flex p={2} justifyContent="center" alignItems="center">
            <Spinner color="blue100" />
          </Flex>
          <Text variant="lg-display">Art Taste Quiz</Text>
          <Text color="black60">Results Completed</Text>
        </Flex>
      </Screen.Body>
    </Screen>
  )
}

const CalculatingResultsScreen = () => {
  return (
    <Screen>
      <Screen.Body>
        <Flex flex={1} justifyContent="center" alignItems="center" textAlign="center">
          <Flex p={2} justifyContent="center" alignItems="center">
            <Spinner color="blue100" />
          </Flex>
          <Text variant="lg-display">Art Taste Quiz</Text>
          <Text color="black60">Calculating Results...</Text>
        </Flex>
      </Screen.Body>
    </Screen>
  )
}

export const ArtQuizResultLoader = () => {
  return (
    <Suspense fallback={<CalculatingResultsScreen />}>
      <ResultsScreen />
    </Suspense>
  )
}

const artQuizResultLoaderQuery = graphql`
  query ArtQuizResultLoaderQuery {
    me {
      quiz {
        savedArtworks {
          internalID
        }
      }
    }
  }
`
