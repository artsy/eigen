import { ArtQuizResultsQuery$data } from "__generated__/ArtQuizResultsQuery.graphql"
import { ArtQuizResultsTabs_me$key } from "__generated__/ArtQuizResultsTabs_me.graphql"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { ArtQuizLikedArtworks } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizLikedArtworks"
import { compact } from "lodash"
import { Button, Flex, Screen, Spacer, Text } from "palette"
import { graphql, useFragment } from "react-relay"

enum Tab {
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

export const ArtQuizResultsTabs = ({ me }: { me: ArtQuizResultsQuery$data["me"] }) => {
  const savedArtworks = useFragment<ArtQuizResultsTabs_me$key>(artQuizResultsTabsFragment, me)?.quiz
    .savedArtworks

  return (
    <Screen>
      <Screen.Body fullwidth>
        <StickyTabPage
          disableBackButtonUpdate
          tabs={compact([
            {
              title: Tab.worksYouLiked,
              content: <ArtQuizLikedArtworks savedArtworks={savedArtworks!} />,
              initial: true,
            },
            {
              title: Tab.collections,
              content: <ArtQuizLikedArtworks savedArtworks={savedArtworks!} />,
            },
            {
              title: Tab.artists,
              content: <ArtQuizLikedArtworks savedArtworks={savedArtworks!} />,
            },
          ])}
          staticHeaderContent={<ArtQuizResultsHeader />}
        />
      </Screen.Body>
    </Screen>
  )
}

const artQuizResultsTabsFragment = graphql`
  fragment ArtQuizResultsTabs_me on Me {
    quiz {
      savedArtworks {
        ...ArtQuizLikedArtworks_me
      }
    }
  }
`
