import { ArtQuizResultsQuery } from "__generated__/ArtQuizResultsQuery.graphql"
import { ArtQuizLoader } from "app/Scenes/ArtQuiz/ArtQuizLoader"
import { ArtQuizResultsEmptyTabs } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizResultsEmptyTabs"
import { ArtQuizResultsTabs } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizResultsTabs"
import { GlobalStore } from "app/store/GlobalStore"
import { Suspense, useEffect } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { useBackHandler } from "shared/hooks/useBackHandler"

const ResultsScreen = () => {
  // prevents Android users from going back with hardware button
  useBackHandler(() => true)

  const queryResult = useLazyLoadQuery<ArtQuizResultsQuery>(artQuizResultsQuery, {})
  const hasSavedArtworks = queryResult.me?.quiz.savedArtworks.length

  useEffect(() => {
    GlobalStore.actions.auth.setArtQuizState("complete")
  }, [])

  if (hasSavedArtworks) {
    return <ArtQuizResultsTabs me={queryResult.me} />
  }

  return (
    <Suspense fallback={<ArtQuizLoader />}>
      <ArtQuizResultsEmptyTabs />
    </Suspense>
  )
}

export const ArtQuizResults = ({ isCalculatingResult }: { isCalculatingResult?: boolean }) => {
  return (
    <Suspense fallback={<ArtQuizLoader isCalculatingResult={isCalculatingResult} />}>
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
