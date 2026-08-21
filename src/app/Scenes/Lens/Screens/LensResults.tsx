import { OwnerType } from "@artsy/cohesion"
import { Screen, SimpleMessage, Spacer } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkGridItem_artwork$data } from "__generated__/ArtworkGridItem_artwork.graphql"
import { LensResultsQuery } from "__generated__/LensResultsQuery.graphql"
import {
  LensResults_artworks$data,
  LensResults_artworks$key,
} from "__generated__/LensResults_artworks.graphql"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { PAGE_SIZE } from "app/Components/constants"
import { LensNavigationStack } from "app/Scenes/Lens/types"
// eslint-disable-next-line no-restricted-imports
import { dismissModal, navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

const SCREEN_TITLE = "Your matches"

type Props = StackScreenProps<LensNavigationStack, "LensResults">

/**
 * Queries `artworksByImageConnection` — the live, pure-vector (neural) image search field. This is
 * NOT the hybrid (lexical + vector) search mechanism: hybrid lives on `filterArtworksConnection`,
 * requires a keyword, and is team-only — unrelated to an uploaded image. Chrome here is deliberately
 * minimal (a bare back-to-dismiss header): the polished results header is Nikita's to build, per the
 * spike plan.
 *
 * Tapping a result can't use `ArtworkGridItem`'s default `RouterLink`-based navigation, which
 * throws "PUSH ... was not handled by any navigator. Do you have a screen named 'Artwork'?".
 * `Lens` is registered with `alwaysPresentModally: true` (`Navigation/routes.tsx`), which places it
 * as a sibling of the tab navigator on the root stack (via `modalRoutes.tsx`) rather than inside a
 * tab's own nested stack, where `Artwork` lives (via `sharedRoutes.tsx`). A PUSH dispatch only
 * bubbles *up* the focused branch, never sideways into an unfocused sibling, so it has nowhere to
 * resolve. Hence `dismissModal(() => navigate(...))`, the same pattern `NavigateTo.tsx` and
 * `DevTools.tsx` use: closing the Lens modal returns focus to whichever tab presented it, and the
 * navigation resolves from there.
 *
 * `disableNavigation` is required alongside `onPress` rather than optional -- see its doc comment
 * on `ArtworkGridItem`. Without it, every tap still fires the broken `navigate(artwork.href)`
 * synchronously, before the deferred `dismissModal` callback runs.
 *
 * Navigation goes by `internalID` rather than `slug`: `internalID` is the stable, always-present
 * identifier, while a slug is a human-readable handle that Metaphysics' `artworkResult(id:)`
 * happens to also accept.
 */
const LensResults: React.FC<Props> = ({ route }) => {
  const { s3Bucket, s3Key } = route.params

  const queryData = useLazyLoadQuery<LensResultsQuery>(lensResultsQuery, {
    s3Bucket,
    s3Key,
    count: PAGE_SIZE,
  })

  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    LensResultsQuery,
    LensResults_artworks$key
  >(artworksFragment, queryData)

  const artworks = extractNodes(data.artworksByImageConnection)

  return (
    <Screen>
      <Screen.AnimatedHeader title={SCREEN_TITLE} onBack={() => dismissModal()} />
      <Screen.StickySubHeader title={SCREEN_TITLE} />

      <Screen.Body fullwidth>
        <ArtworksGrid
          artworks={artworks}
          hasNext={hasNext}
          isLoadingNext={isLoadingNext}
          loadMore={(pageSize) => loadNext(pageSize)}
        />
      </Screen.Body>
    </Screen>
  )
}

const ArtworksGrid: React.FC<{
  artworks: ExtractNodeType<LensResults_artworks$data["artworksByImageConnection"]>[]
  hasNext: boolean
  isLoadingNext: boolean
  loadMore: (pageSize: number) => void
}> = ({ artworks, hasNext, isLoadingNext, loadMore }) => {
  const { scrollHandler } = Screen.useListenForScreenScroll()

  const handlePress = (_artworkSlug: string, artwork?: ArtworkGridItem_artwork$data) => {
    if (!artwork?.internalID) {
      return
    }

    dismissModal(() => navigate(`/artwork/${artwork.internalID}`))
  }

  return (
    <MasonryInfiniteScrollArtworkGrid
      animated
      artworks={artworks}
      contextScreenOwnerType={OwnerType.search}
      contextScreen={OwnerType.search}
      disableNavigation
      ListEmptyComponent={
        <SimpleMessage m={2}>
          We couldn't find any matches for that image. Try another photo.
        </SimpleMessage>
      }
      hasMore={hasNext}
      isLoading={isLoadingNext}
      loadMore={loadMore}
      onPress={handlePress}
      onScroll={scrollHandler}
    />
  )
}

const artworksFragment = graphql`
  fragment LensResults_artworks on Query
  @refetchable(queryName: "LensResultsPaginationQuery")
  @argumentDefinitions(
    s3Bucket: { type: "String!" }
    s3Key: { type: "String!" }
    count: { type: "Int", defaultValue: 30 }
    after: { type: "String" }
  ) {
    artworksByImageConnection(s3Bucket: $s3Bucket, s3Key: $s3Key, first: $count, after: $after)
      @connection(key: "LensResults_artworksByImageConnection") {
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

const lensResultsQuery = graphql`
  query LensResultsQuery($s3Bucket: String!, $s3Key: String!, $count: Int, $after: String) {
    ...LensResults_artworks @arguments(s3Bucket: $s3Bucket, s3Key: $s3Key, count: $count, after: $after)
  }
`

export const LensResultsScreen: React.FC<Props> = (props) => {
  return (
    <Suspense fallback={<Placeholder />}>
      <LensResults {...props} />
    </Suspense>
  )
}

const Placeholder = () => {
  return (
    <ProvidePlaceholderContext>
      <Screen>
        <Screen.AnimatedHeader onBack={() => dismissModal()} title={SCREEN_TITLE} />
        <Screen.StickySubHeader title={SCREEN_TITLE} />
        <Screen.Body fullwidth>
          <Spacer y={2} />
          <PlaceholderGrid />
        </Screen.Body>
      </Screen>
    </ProvidePlaceholderContext>
  )
}
