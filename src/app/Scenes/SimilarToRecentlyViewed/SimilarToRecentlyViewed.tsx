import { OwnerType } from "@artsy/cohesion"
import { Screen, SimpleMessage, Spacer } from "@artsy/palette-mobile"
import { SimilarToRecentlyViewedQuery } from "__generated__/SimilarToRecentlyViewedQuery.graphql"
import {
  SimilarToRecentlyViewed_artworksConnection$data,
  SimilarToRecentlyViewed_artworksConnection$key,
} from "__generated__/SimilarToRecentlyViewed_artworksConnection.graphql"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { PAGE_SIZE } from "app/Components/constants"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { useRefreshControl } from "app/utils/refreshHelpers"
import { ExtractNodeType } from "app/utils/relayHelpers"
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
      <Screen>
        <Screen.AnimatedHeader title={SCREEN_TITLE} onBack={goBack} />
        <Screen.StickySubHeader title={SCREEN_TITLE} />

        <Screen.Body fullwidth>
          <ArtworksGrid
            artworks={artworks}
            RefreshControl={RefreshControl}
            hasNext={hasNext}
            isLoadingNext={isLoadingNext}
            loadMore={(pageSize) => loadNext(pageSize)}
          />
        </Screen.Body>
      </Screen>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

const ArtworksGrid: React.FC<{
  artworks: ExtractNodeType<
    SimilarToRecentlyViewed_artworksConnection$data["similarToRecentlyViewedConnection"]
  >[]
  RefreshControl: React.JSX.Element
  hasNext: boolean
  isLoadingNext: boolean
  loadMore: (pageSize: number) => void
}> = ({ artworks, loadMore, RefreshControl, hasNext, isLoadingNext }) => {
  const { scrollHandler } = Screen.useListenForScreenScroll()
  return (
    <MasonryInfiniteScrollArtworkGrid
      animated
      artworks={artworks}
      contextScreenOwnerType={OwnerType.similarToRecentlyViewed}
      contextScreen={OwnerType.similarToRecentlyViewed}
      ListEmptyComponent={
        <SimpleMessage m={2}>Nothing yet. Please check back later.</SimpleMessage>
      }
      refreshControl={RefreshControl}
      hasMore={hasNext}
      loadMore={loadMore}
      isLoading={isLoadingNext}
      onScroll={scrollHandler}
    />
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
      <Screen>
        <Screen.AnimatedHeader onBack={goBack} title={SCREEN_TITLE} />
        <Screen.StickySubHeader title={SCREEN_TITLE} />
        <Screen.Body fullwidth>
          <Spacer y={2} />
          <PlaceholderGrid />
        </Screen.Body>
      </Screen>
    </ProvidePlaceholderContext>
  )
}
