import { OwnerType } from "@artsy/cohesion"
import { SimpleMessage, Spacer } from "@artsy/palette-mobile"
import { ArtworkRecommendationsQuery } from "__generated__/ArtworkRecommendationsQuery.graphql"
import { ArtworkRecommendations_me$key } from "__generated__/ArtworkRecommendations_me.graphql"
import { InfiniteScrollArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { PAGE_SIZE } from "app/Components/constants"
import { extractNodes } from "app/utils/extractNodes"
import { PlaceholderGrid, ProvidePlaceholderContext } from "app/utils/placeholders"
import { useRefreshControl } from "app/utils/refreshHelpers"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { Suspense } from "react"
import { useLazyLoadQuery, usePaginationFragment } from "react-relay"
import { graphql } from "relay-runtime"

const SCREEN_TITLE = "Artwork Recommendations"

export const ArtworkRecommendations: React.FC = () => {
  const queryData = useLazyLoadQuery<ArtworkRecommendationsQuery>(
    ArtworkRecommendationsScreenQuery,
    ArtworkRecommendationsQueryVariables
  )

  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment<
    ArtworkRecommendationsQuery,
    ArtworkRecommendations_me$key
  >(artworkConnectionFragment, queryData.me)

  const artworks = extractNodes(data?.artworkRecommendations)
  const RefreshControl = useRefreshControl(refetch)

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.artworkRecommendations })}
    >
      <PageWithSimpleHeader title={SCREEN_TITLE}>
        {artworks.length ? (
          <InfiniteScrollArtworksGridContainer
            connection={data?.artworkRecommendations}
            loadMore={(pageSize, onComplete) => loadNext(pageSize, { onComplete } as any)}
            hasMore={() => hasNext}
            isLoading={() => isLoadingNext}
            pageSize={PAGE_SIZE}
            contextScreenOwnerType={OwnerType.artworkRecommendations}
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

export const ArtworkRecommendationsQueryVariables = {
  count: PAGE_SIZE,
}

export const ArtworkRecommendationsScreenQuery = graphql`
  query ArtworkRecommendationsQuery($count: Int, $after: String) {
    me {
      ...ArtworkRecommendations_me @arguments(count: $count, after: $after)
    }
  }
`

const artworkConnectionFragment = graphql`
  fragment ArtworkRecommendations_me on Me
  @refetchable(queryName: "ArtworkRecommendations_meRefetch")
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, after: { type: "String" }) {
    artworkRecommendations(first: $count, after: $after)
      @connection(key: "ArtworkRecommendationsRail_artworkRecommendations") {
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

export const ArtworkRecommendationsScreen: React.FC = (props) => {
  return (
    <Suspense fallback={<Placeholder />}>
      <ArtworkRecommendations {...props} />
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
