import { ArtQuizResultsQuery } from "__generated__/ArtQuizResultsQuery.graphql"
import { ArtQuizResultsLoader } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsLoader"
import { ArtQuizResultsEmptyTabs } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizResultsEmptyTabs"
import { ArtQuizResultsTabs } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizResultsTabs"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

const ResultsScreen = () => {
  const queryResult = useLazyLoadQuery<ArtQuizResultsQuery>(artQuizResultsQuery, {})
  const hasSavedArtworks = queryResult.me?.quiz.savedArtworks.length

  if (hasSavedArtworks) {
    return <ArtQuizResultsTabs me={queryResult.me} />
  }

  return <ArtQuizResultsEmptyTabs />
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
