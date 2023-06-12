import { Flex, Tabs } from "@artsy/palette-mobile"
import { ArtQuizResultsQuery$data } from "__generated__/ArtQuizResultsQuery.graphql"
import { ArtQuizResultsTabs_me$key } from "__generated__/ArtQuizResultsTabs_me.graphql"
import { ArtQuizExploreArtists } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizExploreArtists"
import { ArtQuizExploreArtworks } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizExploreArtworks"
import { ArtQuizLikedArtworks } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizLikedArtworks"
import { ArtQuizResultsTabsHeader } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizResultsTabsHeader"
import { navigate } from "app/system/navigation/navigate"
import React, { useState } from "react"
import { graphql, useFragment } from "react-relay"

type TabName = "worksYouLiked" | "exploreWorks" | "exploreArtists"

export const ArtQuizResultsTabs = ({ me }: { me: ArtQuizResultsQuery$data["me"] }) => {
  const queryResult = useFragment<ArtQuizResultsTabs_me$key>(artQuizResultsTabsFragment, me)?.quiz

  const [activeTab, setActiveTab] = useState<TabName>("worksYouLiked")

  const savedArtworks = queryResult?.savedArtworks!
  const recommendedArtworks = queryResult?.recommendedArtworks!
  const title =
    activeTab === "worksYouLiked" ? "Explore Your Quiz Results" : "Explore Art We Think You'll Love"

  return (
    <Tabs.TabsWithHeader
      title={title}
      lazy
      headerProps={{
        onBack: () => navigate("/"),
      }}
      onTabChange={({ tabName }) => {
        setActiveTab(tabName as TabName)
      }}
      BelowTitleHeaderComponent={() => <BelowHeaderComponent activeTab={activeTab} />}
    >
      <Tabs.Tab name="worksYouLiked" label="Works you liked">
        <Tabs.Lazy>
          <ArtQuizLikedArtworks savedArtworks={savedArtworks} />
        </Tabs.Lazy>
      </Tabs.Tab>
      <Tabs.Tab name="worksForYou" label="Works for You">
        <Tabs.Lazy>
          <ArtQuizExploreArtworks recommendedArtworks={recommendedArtworks} />
        </Tabs.Lazy>
      </Tabs.Tab>
      <Tabs.Tab name="artistsForYou" label="Artists for You">
        <Tabs.Lazy>
          <ArtQuizExploreArtists savedArtworks={savedArtworks} />
        </Tabs.Lazy>
      </Tabs.Tab>
    </Tabs.TabsWithHeader>
  )
}

const BelowHeaderComponent: React.FC<{ activeTab: TabName }> = React.memo((props) => {
  if (props.activeTab === "worksYouLiked") {
    return (
      <Flex mb={1}>
        <ArtQuizResultsTabsHeader subtitle="We think you’ll enjoy these recommendations based on your likes. Keep saving and following to continue tailoring Artsy to you." />
      </Flex>
    )
  }

  return (
    <Flex mb={1}>
      <ArtQuizResultsTabsHeader subtitle="We think you’ll enjoy these recommendations based on your likes. To tailor Artsy to your art tastes, follow artists and save works you love." />
    </Flex>
  )
})

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
