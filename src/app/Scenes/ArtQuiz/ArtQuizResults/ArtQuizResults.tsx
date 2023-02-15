import { ArtQuizResultsQuery } from "__generated__/ArtQuizResultsQuery.graphql"
import { ArtQuizResultsLoader } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsLoader"
import { ArtQuizResultsEmptyTabs } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizResultsEmptyTabs"
import { ArtQuizResultsTabs } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizResultsTabs"
import { Suspense, useEffect, useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

const ResultsScreen = () => {
  const queryResult = useLazyLoadQuery<ArtQuizResultsQuery>(artQuizResultsQuery, {})
  const hasSavedArtworks = queryResult.me?.quiz.savedArtworks.length
  const [isResultReady, setIsResultReady] = useState(!queryResult.me?.quiz.completedAt)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsResultReady(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [hasSavedArtworks])

  if (!isResultReady && hasSavedArtworks) {
    return <ArtQuizResultsLoader isReady />
  }

  if (isResultReady && hasSavedArtworks) {
    return <ArtQuizResultsTabs me={queryResult.me} />
  }

  return (
    <Suspense fallback={<ArtQuizResultsLoader isReady />}>
      <ArtQuizResultsEmptyTabs />
    </Suspense>
  )
}

interface ArtQuizResultsProps {
  utm_medium?: string
  utm_source?: string
}

export const ArtQuizResults = (props: ArtQuizResultsProps) => {
  return (
    <Suspense fallback={<ArtQuizResultsLoader isFromEmail={props.utm_medium === "email"} />}>
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
        completedAt
      }
      ...ArtQuizResultsTabs_me
    }
  }
`
