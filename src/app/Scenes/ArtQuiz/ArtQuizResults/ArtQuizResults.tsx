import { ArtQuizResultsQuery } from "__generated__/ArtQuizResultsQuery.graphql"
import { ArtQuizResultsLoader } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsLoader"
import { ArtQuizResultsEmptyTabs } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizResultsEmptyTabs"
import { ArtQuizResultsTabs } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizResultsTabs"
import { Suspense, useEffect, useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

const ResultsScreen = () => {
  const queryResult = useLazyLoadQuery<ArtQuizResultsQuery>(artQuizResultsQuery, {})
  const hasSavedArtworks = queryResult.me?.quiz.savedArtworks.length
  const [isResultReady, setIsResultReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsResultReady(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!isResultReady) {
    return <ArtQuizResultsLoader isReady />
  }

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
