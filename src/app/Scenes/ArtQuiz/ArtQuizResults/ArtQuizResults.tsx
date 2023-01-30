import { ArtQuizResultsQuery } from "__generated__/ArtQuizResultsQuery.graphql"
import { ArtQuizResultsLoader } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsLoader"
import { ArtQuizResultsTabs } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizResultsTabs"
import { Flex, Screen, Text } from "palette"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

const ResultsScreen = () => {
  const queryResult = useLazyLoadQuery<ArtQuizResultsQuery>(artQuizResultsQuery, {})
  const hasSavedArtworks = queryResult.me?.quiz.savedArtworks.length

  if (hasSavedArtworks) {
    return <ArtQuizResultsTabs me={queryResult.me} />
  }

  return (
    <Screen>
      <Screen.Body>
        <Flex flex={1} justifyContent="center" alignItems="center" textAlign="center">
          <Text variant="lg-display">Art Taste Quiz</Text>
          <Text color="black60">Empty</Text>
        </Flex>
      </Screen.Body>
    </Screen>
  )
}

export const ArtQuizResults = () => {
  return (
    <Suspense fallback={<ArtQuizResultsLoader />}>
      <ResultsScreen />
    </Suspense>
  )
}

const artQuizResultsQuery = graphql`
  query ArtQuizResultsQuery {
    me {
      quiz {
        savedArtworks {
          __typename
        }
      }
      ...ArtQuizResultsTabs_me
    }
  }
`
