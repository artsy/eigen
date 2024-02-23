import { OwnerType } from "@artsy/cohesion"
import { Spacer, SimpleMessage } from "@artsy/palette-mobile"
import { SimilarToRecentlyViewedQuery } from "__generated__/SimilarToRecentlyViewedQuery.graphql"
import { SimilarToRecentlyViewed_artworksConnection$key } from "__generated__/SimilarToRecentlyViewed_artworksConnection.graphql"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { PAGE_SIZE } from "app/Components/constants"
import { extractNodes } from "app/utils/extractNodes"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { useRefreshControl } from "app/utils/refreshHelpers"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

const SCREEN_TITLE = "Similar to Works You've Viewed"

export const SimilarToRecentlyViewed: React.FC = () => {
  const queryData = useLazyLoadQuery<SimilarToRecentlyViewedQuery>(
    SimilarToRecentlyViewedScreenQuery,
    similarToRecentlyViewedQueryVariables
  )

  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment<
    SimilarToRecentlyViewedQuery,
    SimilarToRecentlyViewed_artworksConnection$key
  >(artworkConnectionFragment, queryData.me)

  const artworks = extractNodes(data?.similarToRecentlyViewedConnection)
  const RefreshControl = useRefreshControl(refetch)

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.similarToRecentlyViewed })}
    >
      <PageWithSimpleHeader title={SCREEN_TITLE}>
        <MasonryInfiniteScrollArtworkGrid
          artworks={artworks}
          contextScreenOwnerType={OwnerType.similarToRecentlyViewed}
          contextScreen={OwnerType.similarToRecentlyViewed}
          ListEmptyComponent={
            <SimpleMessage m={2}>Nothing yet. Please check back later.</SimpleMessage>
          }
          refreshControl={RefreshControl}
          hasMore={hasNext}
          loadMore={(pageSize) => loadNext(pageSize)}
          isLoading={isLoadingNext}
        />
      </PageWithSimpleHeader>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

export const similarToRecentlyViewedQueryVariables = {
  count: PAGE_SIZE,
}

export const SimilarToRecentlyViewedScreenQuery = graphql`
  query SimilarToRecentlyViewedQuery($count: Int, $after: String) {
    me {
      ...SimilarToRecentlyViewed_artworksConnection @arguments(count: $count, after: $after)
    }
  }
`

const artworkConnectionFragment = graphql`
  fragment SimilarToRecentlyViewed_artworksConnection on Me
  @refetchable(queryName: "SimilarToRecentlyViewed_artworksConnectionRefetch")
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, after: { type: "String" }) {
    similarToRecentlyViewedConnection(first: $count, after: $after)
      @connection(key: "SimilarToRecentlyViewed_similarToRecentlyViewedConnection")
      @principalField {
      edges {
        node {
          id
          slug
          image(includeAll: false) {
            aspectRatio
            blurhash
          }
          ...ArtworkGridItem_artwork @arguments(includeAllImages: false)
        }
      }
    }
  }
`

export const SimilarToRecentlyViewedScreen: React.FC = () => {
  return (
    <Suspense fallback={<Placeholder />}>
      <SimilarToRecentlyViewed />
    </Suspense>
  )
}

const Placeholder = () => {
  return (
    <ProvidePlaceholderContext>
      <PageWithSimpleHeader title={SCREEN_TITLE}>
        <Spacer y={2} />
        <PlaceholderGrid />
      </PageWithSimpleHeader>
    </ProvidePlaceholderContext>
  )
}
