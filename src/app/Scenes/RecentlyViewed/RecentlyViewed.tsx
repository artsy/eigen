import { OwnerType } from "@artsy/cohesion"
import { Spacer, SimpleMessage } from "@artsy/palette-mobile"
import { RecentlyViewedQuery } from "__generated__/RecentlyViewedQuery.graphql"
import { RecentlyViewed_artworksConnection$key } from "__generated__/RecentlyViewed_artworksConnection.graphql"
import { InfiniteScrollArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { PAGE_SIZE } from "app/Components/constants"
import { extractNodes } from "app/utils/extractNodes"
import { PlaceholderGrid, ProvidePlaceholderContext } from "app/utils/placeholders"
import { useRefreshControl } from "app/utils/refreshHelpers"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

const SCREEN_TITLE = "Recently Viewed"

export const RecentlyViewed: React.FC = () => {
  const queryData = useLazyLoadQuery<RecentlyViewedQuery>(
    RecentlyViewedScreenQuery,
    recentlyViewedQueryVariables
  )

  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment<
    RecentlyViewedQuery,
    RecentlyViewed_artworksConnection$key
  >(artworkConnectionFragment, queryData.me)

  const artworks = extractNodes(data?.recentlyViewedArtworksConnection)
  const RefreshControl = useRefreshControl(refetch)

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.recentlyViewed })}
    >
      <PageWithSimpleHeader title={SCREEN_TITLE}>
        {artworks.length ? (
          <InfiniteScrollArtworksGridContainer
            connection={data?.recentlyViewedArtworksConnection}
            loadMore={(pageSize, onComplete) => loadNext(pageSize, { onComplete } as any)}
            hasMore={() => hasNext}
            isLoading={() => isLoadingNext}
            pageSize={PAGE_SIZE}
            contextScreenOwnerType={OwnerType.recentlyViewed}
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

export const recentlyViewedQueryVariables = {
  count: PAGE_SIZE,
}

export const RecentlyViewedScreenQuery = graphql`
  query RecentlyViewedQuery($count: Int, $after: String) {
    me {
      ...RecentlyViewed_artworksConnection @arguments(count: $count, after: $after)
    }
  }
`

const artworkConnectionFragment = graphql`
  fragment RecentlyViewed_artworksConnection on Me
  @refetchable(queryName: "RecentlyViewed_artworksConnectionRefetch")
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, after: { type: "String" }) {
    recentlyViewedArtworksConnection(first: $count, after: $after)
      @connection(key: "RecentlyViewed_recentlyViewedArtworksConnection") {
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

export const RecentlyViewedScreen: React.FC = () => {
  return (
    <Suspense fallback={<Placeholder />}>
      <RecentlyViewed />
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
