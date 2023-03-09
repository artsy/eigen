import { OwnerType } from "@artsy/cohesion"
import { Spacer } from "@artsy/palette-mobile"
import { InfiniteScrollArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { PAGE_SIZE } from "app/Components/constants"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { extractNodes } from "app/utils/extractNodes"
import { PlaceholderGrid, ProvidePlaceholderContext } from "app/utils/placeholders"
import { useRefreshControl } from "app/utils/refreshHelpers"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { SimpleMessage } from "palette"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"
import { SimilarToRecentlyViewedQuery } from "__generated__/SimilarToRecentlyViewedQuery.graphql"
import { SimilarToRecentlyViewed_artworksConnection$key } from "__generated__/SimilarToRecentlyViewed_artworksConnection.graphql"

const SCREEN_TITLE = "Similar to Works You've Viewed"

interface SimilarToRecentlyViewedScreenProps {}

export const SimilarToRecentlyViewed: React.FC<SimilarToRecentlyViewedScreenProps> = () => {
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
        {artworks.length ? (
          <InfiniteScrollArtworksGridContainer
            connection={data?.similarToRecentlyViewedConnection}
            loadMore={(pageSize, onComplete) =>
              loadNext(pageSize, { onComplete: onComplete as any })
            }
            hasMore={() => hasNext}
            isLoading={() => isLoadingNext}
            pageSize={PAGE_SIZE}
            contextScreenOwnerType={OwnerType.similarToRecentlyViewed}
            HeaderComponent={<Spacer y={2} />}
            shouldAddPadding
            refreshControl={RefreshControl}
          />
        ) : (
          <SimpleMessage m={2}>Nothing yet. Please check back later.</SimpleMessage>
        )}
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
      @connection(key: "SimilarToRecentlyViewed_similarToRecentlyViewedConnection") {
      edges {
        cursor
        node {
          internalID
        }
      }
      ...InfiniteScrollArtworksGrid_connection
    }
  }
`

export const SimilarToRecentlyViewedScreen: React.FC<SimilarToRecentlyViewedScreenProps> = (
  props
) => {
  return (
    <Suspense fallback={<Placeholder />}>
      <SimilarToRecentlyViewed {...props} />
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
