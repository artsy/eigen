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
import { SearchByPhotoButton } from "app/Components/SearchByPhotoButton/SearchByPhotoButton"
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

type Navigation = Props["navigation"]

/**
 * Back out of the Lens flow entirely and land on the Search tab.
 *
 * Deliberately not a local `goBack`: `LensAnalyzing` replaced itself with this screen, so the only
 * thing left in the stack below is the live camera, and popping onto a running viewfinder is a
 * jarring answer to "back". `/search` is the surface Lens is entered from -- its search input opens
 * the overlay that carries the "Search by photo" button -- so it's both a familiar landing spot and
 * a short route back into a second search.
 *
 * `dismissModal(() => navigate(...))` rather than a bare `navigate` for the same reason as the
 * artwork tap below: Lens is `alwaysPresentModally`, a sibling of the tab navigator, so the modal
 * has to close before a tab route can resolve.
 */
const backToSearch = () => {
  dismissModal(() => navigate("/search"))
}

/**
 * Restart the flow from the camera. `navigate` rather than `push`: `LensCamera` is this stack's root
 * and is still mounted below, so this pops back to it instead of stacking a second camera.
 */
const restartSearch = (navigation: Navigation) => {
  navigation.navigate("LensCamera")
}

/**
 * Queries `artworksByImageConnection` — the live, pure-vector (neural) image search field. This is
 * NOT the hybrid (lexical + vector) search mechanism: hybrid lives on `filterArtworksConnection`,
 * requires a keyword, and is team-only — unrelated to an uploaded image. Chrome here is deliberately
 * minimal: the polished results header is Nikita's to build, per the spike plan.
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
const LensResults: React.FC<Props> = ({ route, navigation }) => {
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
  // The query has resolved by the time this renders (Suspense holds the placeholder until it does),
  // so an empty list here means genuinely no matches rather than "not loaded yet".
  const hasNoMatches = artworks.length === 0

  return (
    <Screen>
      <Screen.AnimatedHeader title={SCREEN_TITLE} onBack={() => backToSearch()} />
      <Screen.StickySubHeader title={SCREEN_TITLE} />

      <Screen.Body fullwidth>
        <ArtworksGrid
          artworks={artworks}
          hasNext={hasNext}
          isLoadingNext={isLoadingNext}
          loadMore={(pageSize) => loadNext(pageSize)}
        />
      </Screen.Body>

      {/* Only on the empty state: with matches on screen the next action is tapping one of them,
          and a permanent CTA over the grid would compete with that. With nothing to tap, "try
          another photo" is the only thing left to do, so it gets a button rather than living in
          the empty-state sentence as an instruction the user can't act on. */}
      {!!hasNoMatches && (
        <Screen.BottomView>
          <SearchByPhotoButton
            testID="lensResultsSearchByPhotoButton"
            onPress={() => restartSearch(navigation)}
          />
        </Screen.BottomView>
      )}
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
    ...LensResults_artworks
      @arguments(s3Bucket: $s3Bucket, s3Key: $s3Key, count: $count, after: $after)
  }
`

export const LensResultsScreen: React.FC<Props> = (props) => {
  return (
    <Suspense fallback={<Placeholder onBack={() => backToSearch()} />}>
      <LensResults {...props} />
    </Suspense>
  )
}

const Placeholder: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <ProvidePlaceholderContext>
      <Screen>
        <Screen.AnimatedHeader onBack={onBack} title={SCREEN_TITLE} />
        <Screen.StickySubHeader title={SCREEN_TITLE} />
        <Screen.Body fullwidth>
          <Spacer y={2} />
          <PlaceholderGrid />
        </Screen.Body>
      </Screen>
    </ProvidePlaceholderContext>
  )
}
