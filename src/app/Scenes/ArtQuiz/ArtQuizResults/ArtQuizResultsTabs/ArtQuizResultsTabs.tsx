import { Flex, Screen } from "@artsy/palette-mobile"
import { ArtQuizResultsQuery$data } from "__generated__/ArtQuizResultsQuery.graphql"
import { ArtQuizResultsTabs_me$key } from "__generated__/ArtQuizResultsTabs_me.graphql"
import { TabsContainer } from "app/Components/Tabs/TabsContainer"
import { ArtQuizExploreArtists } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizExploreArtists"
import { ArtQuizExploreArtworks } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizExploreArtworks"
import { ArtQuizLikedArtworks } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizLikedArtworks"
import { ArtQuizResultsTabsHeader } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizResultsTabsHeader"
import { navigate } from "app/system/navigation/navigate"
import { Tabs } from "react-native-collapsible-tab-view"
import { graphql, useFragment } from "react-relay"

export const ArtQuizResultsTabs = ({ me }: { me: ArtQuizResultsQuery$data["me"] }) => {
  const queryResult = useFragment<ArtQuizResultsTabs_me$key>(artQuizResultsTabsFragment, me)?.quiz

  const savedArtworks = queryResult?.savedArtworks!
  const recommendedArtworks = queryResult?.recommendedArtworks!

  return (
    <Screen>
      <Screen.Body fullwidth>
        <Screen.Header onBack={() => navigate("/")} />
        <TabsContainer
          lazy
          renderHeader={() => {
            return (
              <Flex mb={1}>
                <ArtQuizResultsTabsHeader
                  title="Explore Your Quiz Results"
                  subtitle="We think you’ll enjoy these recommendations based on your likes. To tailor Artsy to your art tastes, follow artists and save works you love."
                />
              </Flex>
            )
          }}
        >
          <Tabs.Tab name="worksYouLiked" label="Works you liked">
            <Tabs.Lazy>
              <ArtQuizLikedArtworks savedArtworks={savedArtworks} />
            </Tabs.Lazy>
          </Tabs.Tab>
          <Tabs.Tab name="exploreWorks" label="Explore Works">
            <Tabs.Lazy>
              <ArtQuizExploreArtworks recommendedArtworks={recommendedArtworks} />
            </Tabs.Lazy>
          </Tabs.Tab>
          <Tabs.Tab name="exploreArtists" label="Explore Artists">
            <Tabs.Lazy>
              <ArtQuizExploreArtists savedArtworks={savedArtworks} />
            </Tabs.Lazy>
          </Tabs.Tab>
        </TabsContainer>
      </Screen.Body>
    </Screen>
  )
}

const artQuizResultsTabsFragment = graphql`
  fragment ArtQuizResultsTabs_me on Me {
    quiz {
      recommendedArtworks {
        ...ArtQuizExploreArtworksFragment_artwork
      }
      savedArtworks {
        ...ArtQuizLikedArtworks_artworks
        ...ArtQuizExploreArtists_artworks
      }
    }
  }
`
