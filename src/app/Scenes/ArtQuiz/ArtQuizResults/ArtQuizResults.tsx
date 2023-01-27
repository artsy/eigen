import { ArtQuizResultsQuery } from "__generated__/ArtQuizResultsQuery.graphql"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { ArtQuizLikedArtworks } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizLikedArtworks"
import { compact } from "lodash"
import { Button, Flex, Screen, Spacer, Spinner, Text } from "palette"
import { Suspense, useEffect, useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

export enum Tab {
  worksYouLiked = "Works you liked",
  collections = "Collections",
  artists = "Artists",
}

const ArtQuizResultsHeader = () => {
  return (
    <Flex px={2}>
      <Text variant="lg">Explore Your Quiz Results</Text>
      <Text variant="lg-display" color="black60">
        Explore these collections and artists recommended based on your likes. Follow them to see
        their latest works on your Artsy home.
      </Text>
      <Spacer m={1} />
      <Button size="small" variant="outlineGray">
        Email My Results
      </Button>
    </Flex>
  )
}

const ResultsScreen = () => {
  const queryResult = useLazyLoadQuery<ArtQuizResultsQuery>(artQuizResultsQuery, {})
  const [isResultReady, setIsResultReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsResultReady(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [queryResult.me])

  if (isResultReady) {
    return (
      <Screen>
        <Screen.Body fullwidth>
          <StickyTabPage
            disableBackButtonUpdate
            tabs={compact([
              {
                title: Tab.worksYouLiked,
                content: <ArtQuizLikedArtworks me={queryResult.me} />,
                initial: true,
              },
              {
                title: Tab.collections,
                content: <ArtQuizLikedArtworks me={queryResult.me} />,
              },
              {
                title: Tab.artists,
                content: <ArtQuizLikedArtworks me={queryResult.me} />,
              },
            ])}
            staticHeaderContent={<ArtQuizResultsHeader />}
          />
        </Screen.Body>
      </Screen>
    )
  }

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

export const ArtQuizResults = () => {
  return (
    <Suspense fallback={<CalculatingResultsScreen />}>
      <ResultsScreen />
    </Suspense>
  )
}

const artQuizResultsQuery = graphql`
  query ArtQuizResultsQuery {
    me {
      ...ArtQuizLikedArtworks_me
    }
  }
`
