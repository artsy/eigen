import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { ArtQuizLikedArtworks } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizLikedArtworks"
import { compact } from "lodash"
import { Button, Flex, Screen, Spacer, Text } from "palette"

export enum Tab {
  worksYouLiked = "Works you liked",
  collections = "Collections",
  artists = "Artists",
}

export const ArtQuizResults = () => {
  return (
    <Screen>
      <Screen.Body fullwidth>
        <StickyTabPage
          disableBackButtonUpdate
          tabs={compact([
            {
              title: Tab.worksYouLiked,
              content: <ArtQuizLikedArtworks />,
              initial: true,
            },
            {
              title: Tab.collections,
              content: <ArtQuizLikedArtworks />,
            },
            {
              title: Tab.artists,
              content: <ArtQuizLikedArtworks />,
            },
          ])}
          staticHeaderContent={<ArtQuizResultsHeader />}
        />
      </Screen.Body>
    </Screen>
  )
}

const ArtQuizResultsHeader = () => {
  return (
    <Flex px={1}>
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
