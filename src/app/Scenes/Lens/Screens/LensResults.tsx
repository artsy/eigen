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
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

const SCREEN_TITLE = "Your matches"

type Props = StackScreenProps<LensNavigationStack, "LensResults">

type Navigation = Props["navigation"]

const backToSearch = () => {
  dismissModal(() => navigate("/search"))
}

/** `navigate`, not `push`: LensCamera is this stack's root and still mounted below. */
const restartSearch = (navigation: Navigation) => {
  navigation.navigate("LensCamera")
}

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
  // Suspense holds the placeholder until the query resolves, so empty here means no matches.
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

      {/* Empty state only: with matches on screen, tapping one is the action, and a permanent CTA
          over the grid would compete with it. */}
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
  /**
   * Android hardware back, which the stack would otherwise handle itself by popping -- onto the
   * live camera `LensAnalyzing` left below. Registered above the Suspense boundary so it covers the
   * loading state too, and returns `true` to keep the stack's own handler from running after it.
   */
  useBackHandler(() => {
    backToSearch()
    return true
  })

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
