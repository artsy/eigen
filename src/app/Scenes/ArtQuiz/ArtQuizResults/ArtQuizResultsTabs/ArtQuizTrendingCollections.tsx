import { ArtQuizResultsEmptyTabsQuery$data } from "__generated__/ArtQuizResultsEmptyTabsQuery.graphql"
import { ArtQuizTrendingCollections_viewer$key } from "__generated__/ArtQuizTrendingCollections_viewer.graphql"
import { StickyTabPageFlatList } from "app/Components/StickyTabPage/StickyTabPageFlatList"
import { ArtQuizTrendingCollection } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizTrendingCollection"
import { graphql, useFragment } from "react-relay"

export const ArtQuizTrendingCollections = ({
  viewer,
}: {
  viewer: ArtQuizResultsEmptyTabsQuery$data["viewer"]
}) => {
  const viewerData = useFragment<ArtQuizTrendingCollections_viewer$key>(
    artQuizTrendingCollectionsFragment,
    viewer
  )

  const marketingCollections = viewerData?.marketingCollections?.map((collection) => ({
    key: collection?.internalID!,
    content: <ArtQuizTrendingCollection collectionData={collection} />,
  }))

  return (
    <StickyTabPageFlatList
      style={{ paddingHorizontal: 0 }}
      data={marketingCollections!}
      initialNumToRender={2}
      keyExtractor={(item, index) => String(item?.collection?.internalID || index)}
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
