import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Screen, SimpleMessage } from "@artsy/palette-mobile"
import { SimilarArtworksQuery } from "__generated__/SimilarArtworksQuery.graphql"
import { SimilarArtworks_artworks$key } from "__generated__/SimilarArtworks_artworks.graphql"
import { LensResultsHeader } from "app/Components/ArtsyLens/LensResultsHeader"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { PAGE_SIZE } from "app/Components/constants"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useState } from "react"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

const SEARCHING_TITLE = "Searching for similar works…"
const MATCHES_TITLE = "Works similar to this artwork"
const NO_MATCHES_MESSAGE = "We couldn't find similar works for this artwork yet."

interface SimilarArtworksProps {
  artworkID: string
}

interface SimilarArtworksWithRetryProps extends SimilarArtworksProps {
  fetchKey: number
  onRetry: () => void
}

const SimilarArtworks: React.FC<SimilarArtworksWithRetryProps> = ({ artworkID, fetchKey }) => {
  const queryData = useLazyLoadQuery<SimilarArtworksQuery>(
    similarArtworksQuery,
    { artworkID, count: PAGE_SIZE },
    // Relay caches the failed request, so a retry needs a new key to fetch again
    { fetchKey }
  )

  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    SimilarArtworksQuery,
    SimilarArtworks_artworks$key
  >(artworksFragment, queryData)

  const artworks = extractNodes(data.artworksConnection)

  return (
    <Screen>
      <LensResultsHeader
        onBack={goBack}
        imageUri={queryData.artwork?.image?.url}
        title={MATCHES_TITLE}
      />

      <Screen.Body fullwidth pt={1}>
        <MasonryInfiniteScrollArtworkGrid
          artworks={artworks}
          contextModule={ContextModule.artworkGrid}
          contextScreenOwnerType={OwnerType.searchByImage}
          contextScreen={OwnerType.searchByImage}
          ListEmptyComponent={<EmptyState />}
          hasMore={hasNext}
          isLoading={isLoadingNext}
          loadMore={(pageSize) => loadNext(pageSize)}
        />
      </Screen.Body>
    </Screen>
  )
}

const EmptyState: React.FC = () => {
  return (
    <SimpleMessage m={2} testID="similar-artworks-empty-state">
      {NO_MATCHES_MESSAGE}
    </SimpleMessage>
  )
}

const artworksFragment = graphql`
  fragment SimilarArtworks_artworks on Query
  @refetchable(queryName: "SimilarArtworksPaginationQuery")
  @argumentDefinitions(
    artworkID: { type: "String!" }
    count: { type: "Int", defaultValue: 30 }
    after: { type: "String" }
  ) {
    artworksConnection(similarToArtworkID: $artworkID, first: $count, after: $after)
      @connection(key: "SimilarArtworks_artworksConnection") {
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

export const similarArtworksQuery = graphql`
  query SimilarArtworksQuery($artworkID: String!, $count: Int, $after: String) {
    artwork(id: $artworkID) {
      image(includeAll: false) {
        url(version: ["square", "small"])
      }
    }
    ...SimilarArtworks_artworks @arguments(artworkID: $artworkID, count: $count, after: $after)
  }
`

const SimilarArtworksPlaceholder: React.FC = () => {
  return (
    <Screen>
      <LensResultsHeader onBack={goBack} title={SEARCHING_TITLE} />
      <Screen.Body fullwidth pt={1}>
        <PlaceholderGrid />
      </Screen.Body>
    </Screen>
  )
}

const SimilarArtworksWithSuspense = withSuspense<SimilarArtworksWithRetryProps>({
  Component: SimilarArtworks,
  LoadingFallback: SimilarArtworksPlaceholder,
  // Keeps a way back on screen and lets the user retry, instead of the route-level error screen
  ErrorFallback: ({ error, resetErrorBoundary }, { onRetry }) => (
    <Screen>
      <LensResultsHeader onBack={goBack} />
      <Screen.Body fullwidth>
        <LoadFailureView
          error={error}
          onRetry={() => {
            onRetry()
            resetErrorBoundary()
          }}
          useSafeArea={false}
          trackErrorBoundary={false}
        />
      </Screen.Body>
    </Screen>
  ),
})

export const SimilarArtworksScreen: React.FC<SimilarArtworksProps> = ({ artworkID }) => {
  const [fetchKey, setFetchKey] = useState(0)

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.searchByImage,
        context_screen_owner_slug: artworkID,
      })}
    >
      <SimilarArtworksWithSuspense
        artworkID={artworkID}
        fetchKey={fetchKey}
        onRetry={() => setFetchKey((key) => key + 1)}
      />
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
