import { Flex, Tabs } from "@artsy/palette-mobile"
import { ArtQuizResultsEmptyTabsQuery } from "__generated__/ArtQuizResultsEmptyTabsQuery.graphql"

import { ArtQuizResultsTabsHeader } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizResultsTabsHeader"
import { ArtQuizTrendingArtists } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizTrendingArtists"
import { ArtQuizTrendingCollections } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizTrendingCollections"
import { navigate } from "app/system/navigation/navigate"

import { graphql, useLazyLoadQuery } from "react-relay"

export const ArtQuizResultsEmptyTabs = () => {
  const queryResult = useLazyLoadQuery<ArtQuizResultsEmptyTabsQuery>(
    artQuizResultsEmptyTabsQuery,
    {}
  )

  return (
    <Tabs.TabsWithHeader
      title="Explore Your Quiz Results"
      lazy
      headerProps={{
        onBack: () => navigate("/"),
      }}
      BelowTitleHeaderComponent={() => (
        <Flex mb={1}>
          <ArtQuizResultsTabsHeader subtitle="There are almost 2 million artworks on Artsy—keep exploring to find something you love." />
        </Flex>
      )}
    >
      <Tabs.Tab name="trendingCollections" label="Trending Collections">
        <Tabs.Lazy>
          <ArtQuizTrendingCollections viewer={queryResult.viewer} />
        </Tabs.Lazy>
      </Tabs.Tab>
      <Tabs.Tab name="trendingArtists" label="Trending Artists">
        <Tabs.Lazy>
          <ArtQuizTrendingArtists viewer={queryResult.viewer} />
        </Tabs.Lazy>
      </Tabs.Tab>
    </Tabs.TabsWithHeader>
  )
}

const artQuizResultsEmptyTabsQuery = graphql`
  query ArtQuizResultsEmptyTabsQuery {
    viewer {
      ...ArtQuizTrendingCollections_viewer
      ...ArtQuizTrendingArtists_viewer
    }
  }
`
