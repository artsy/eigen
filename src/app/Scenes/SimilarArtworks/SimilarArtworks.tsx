import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Screen, SimpleMessage } from "@artsy/palette-mobile"
import { SimilarArtworksQuery } from "__generated__/SimilarArtworksQuery.graphql"
import { SimilarArtworks_artworks$key } from "__generated__/SimilarArtworks_artworks.graphql"
import { LensResultsHeader } from "app/Components/ArtsyLens/LensResultsHeader"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { PAGE_SIZE } from "app/Components/constants"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

const SEARCHING_TITLE = "Searching for similar works…"
const MATCHES_TITLE = "Works similar to this artwork"
const NO_MATCHES_MESSAGE = "We couldn't find similar works for this artwork yet."

interface SimilarArtworksProps {
  artworkID: string
}

const SimilarArtworks: React.FC<SimilarArtworksProps> = ({ artworkID }) => {
  const queryData = useLazyLoadQuery<SimilarArtworksQuery>(similarArtworksQuery, {
    artworkID,
    count: PAGE_SIZE,
  })

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

/**
 * Shown when the query fails (e.g. the API doesn't support searching by artwork yet). Keeps the
 * header so the user can always navigate back.
 */
const SimilarArtworksError: React.FC = () => {
  return (
    <Screen>
      <LensResultsHeader onBack={goBack} title={MATCHES_TITLE} />
      <Screen.Body fullwidth pt={1}>
        <EmptyState />
      </Screen.Body>
    </Screen>
  )
}

const SimilarArtworksWithSuspense = withSuspense<SimilarArtworksProps>({
  Component: SimilarArtworks,
  LoadingFallback: SimilarArtworksPlaceholder,
  ErrorFallback: () => <SimilarArtworksError />,
})

export const SimilarArtworksScreen: React.FC<SimilarArtworksProps> = ({ artworkID }) => {
  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.searchByImage,
        context_screen_owner_slug: artworkID,
      })}
    >
      <SimilarArtworksWithSuspense artworkID={artworkID} />
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
