import { Flex, Screen } from "@artsy/palette-mobile"
import { ArtQuizResultsQuery$data } from "__generated__/ArtQuizResultsQuery.graphql"
import { ArtQuizResultsTabs_me$key } from "__generated__/ArtQuizResultsTabs_me.graphql"
import { TabsContainer } from "app/Components/Tabs/TabsContainer"
import { ArtQuizExploreArtists } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizExploreArtists"
import { ArtQuizExploreArtworks } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizExploreArtworks"
import { ArtQuizLikedArtworks } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizLikedArtworks"
import { ArtQuizResultsTabsHeader } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizResultsTabsHeader"
import { navigate } from "app/system/navigation/navigate"
import { useState } from "react"
import { Tabs } from "react-native-collapsible-tab-view"
import { graphql, useFragment } from "react-relay"

enum Tab {
  worksYouLiked = "Works you liked",
  worksForYou = "Works for You",
  artistsForYou = "Artists for You",
}

export const ArtQuizResultsTabs = ({ me }: { me: ArtQuizResultsQuery$data["me"] }) => {
  const queryResult = useFragment<ArtQuizResultsTabs_me$key>(artQuizResultsTabsFragment, me)?.quiz

  const [activeTab, setActiveTab] = useState<string>(Tab.worksYouLiked)

  const savedArtworks = queryResult?.savedArtworks!
  const recommendedArtworks = queryResult?.recommendedArtworks!

  return (
    <Screen>
      <Screen.Body fullwidth>
        <Screen.Header onBack={() => navigate("/")} />
        <TabsContainer
          tabScrollEnabled
          // TODO: Figure out why this doesn't work
          onTabChange={(tab) => {
            console.log(tab)
            setActiveTab(tab.tabName)
          }}
          renderHeader={() => {
            return (
              <Flex mb={1}>
                {activeTab === "worksYouLiked" ? (
                  <ArtQuizResultsTabsHeader
                    title="Explore Art We Think You'll Love"
                    subtitle="We think you’ll enjoy these recommendations based on your likes. Keep saving and following to continue tailoring Artsy to you."
                  />
                ) : (
                  <ArtQuizResultsTabsHeader
                    title="Explore Your Quiz Results"
                    subtitle="We think you’ll enjoy these recommendations based on your likes. To tailor Artsy to your art tastes, follow artists and save works you love."
                  />
                )}
              </Flex>
            )
          }}
        >
          <Tabs.Tab name="worksYouLiked" label={Tab.worksYouLiked}>
            <ArtQuizLikedArtworks savedArtworks={savedArtworks} />
          </Tabs.Tab>
          <Tabs.Tab name="worksForYou" label={Tab.worksForYou}>
            <ArtQuizExploreArtworks recommendedArtworks={recommendedArtworks} />
          </Tabs.Tab>
          <Tabs.Tab name="artistsForYou" label={Tab.artistsForYou}>
            <ArtQuizExploreArtists savedArtworks={savedArtworks} />
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
