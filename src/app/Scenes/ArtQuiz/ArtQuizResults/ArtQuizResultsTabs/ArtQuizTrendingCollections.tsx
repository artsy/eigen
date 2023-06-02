import { Tabs } from "@artsy/palette-mobile"
import { ArtQuizResultsEmptyTabsQuery$data } from "__generated__/ArtQuizResultsEmptyTabsQuery.graphql"
import { ArtQuizTrendingCollections_viewer$key } from "__generated__/ArtQuizTrendingCollections_viewer.graphql"

import { ArtQuizTrendingCollection } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizTrendingCollection"
import { graphql, useFragment } from "react-relay"

interface ArtQuizTrendingCollectionsProps {
  viewer: ArtQuizResultsEmptyTabsQuery$data["viewer"]
}

export const ArtQuizTrendingCollections: React.FC<ArtQuizTrendingCollectionsProps> = ({
  viewer,
}) => {
  const viewerData = useFragment<ArtQuizTrendingCollections_viewer$key>(
    artQuizTrendingCollectionsFragment,
    viewer
  )

  return (
    <Tabs.FlatList
      data={viewerData?.marketingCollections!}
      initialNumToRender={2}
      keyExtractor={(item, index) => String(item?.internalID || index)}
      renderItem={({ item, index }) => {
        return <ArtQuizTrendingCollection collectionData={item} key={index} />
      }}
    />
  )
}

const artQuizTrendingCollectionsFragment = graphql`
  fragment ArtQuizTrendingCollections_viewer on Viewer {
    marketingCollections(
      slugs: [
        "trending-this-week"
        "iconic-prints"
        "street-art-highlights"
        "artists-on-the-rise"
        "finds-under-1000-dollars"
        "top-auction-lots"
        "curators-picks-emerging"
        "contemporary-now"
      ]
    ) {
      ...ArtQuizTrendingCollection_collection
      internalID
    }
  }
`
