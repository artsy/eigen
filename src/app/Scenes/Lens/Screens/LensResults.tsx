import {
  ActionType,
  ContextModule,
  OwnerType,
  SearchedByImageWithNoResults,
  SearchedByImageWithResults,
} from "@artsy/cohesion"
import { Screen, SimpleMessage } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { LensResultsQuery } from "__generated__/LensResultsQuery.graphql"
import {
  LensResults_artworks$data,
  LensResults_artworks$key,
} from "__generated__/LensResults_artworks.graphql"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { SearchByPhotoButton } from "app/Components/SearchByPhotoButton/SearchByPhotoButton"
import { PAGE_SIZE } from "app/Components/constants"
import { LensResultsHeader } from "app/Scenes/Lens/Components/LensResultsHeader"
import { LensNavigationStack } from "app/Scenes/Lens/types"
import { discardTempPhotos } from "app/Scenes/Lens/utils/discardTempPhotos"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { Suspense, useEffect } from "react"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"
import { useTracking } from "react-tracking"

const MATCHES_TITLE = "Great taste! Here are some matches to your photo"
const NO_MATCHES_TITLE = "Unfortunately, we couldn't find great matches for that photo"
const SEARCHING_TITLE = "Searching for matches..."

type Props = StackScreenProps<LensNavigationStack, "LensResults">

type Navigation = Props["navigation"]

/** `navigate`, not `push`: LensCamera is this stack's root and still mounted below. */
const restartSearch = (navigation: Navigation) => {
  navigation.navigate("LensCamera")
}

const LensResults: React.FC<Props> = ({ route, navigation }) => {
  const { s3Bucket, s3Key, photoUri, fromLibrary } = route.params
  const tracking = useTracking()

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

  useEffect(() => {
    const photoSource = fromLibrary ? "photo_library" : "camera"

    tracking.trackEvent(
      hasNoMatches
        ? tracks.searchedByImageWithNoResults(photoSource)
        : tracks.searchedByImageWithResults(photoSource)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Screen>
      <LensResultsHeader
        onBack={goBack}
        photoUri={photoUri}
        title={hasNoMatches ? NO_MATCHES_TITLE : MATCHES_TITLE}
      />

      <Screen.Body fullwidth pt={1}>
        <ArtworksGrid
          artworks={artworks}
          hasNext={hasNext}
          isLoadingNext={isLoadingNext}
          loadMore={(pageSize) => loadNext(pageSize)}
        />
      </Screen.Body>

      {!!hasNoMatches && (
        <Screen.BottomView>
          <SearchByPhotoButton
            testID="lensResultsSearchByPhotoButton"
            label="Try another photo"
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
  return (
    <MasonryInfiniteScrollArtworkGrid
      artworks={artworks}
      contextModule={ContextModule.artworkGrid}
      contextScreenOwnerType={OwnerType.searchByImage}
      contextScreen={OwnerType.searchByImage}
      ListEmptyComponent={
        <SimpleMessage m={2}>No matches found. Please try another photo.</SimpleMessage>
      }
      hasMore={hasNext}
      isLoading={isLoadingNext}
      loadMore={loadMore}
    />
  )
}

type PhotoSource = SearchedByImageWithResults["photo_source"]

const tracks = {
  searchedByImageWithResults: (photoSource: PhotoSource): SearchedByImageWithResults => ({
    action: ActionType.searchedByImageWithResults,
    context_owner_type: OwnerType.searchByImage,
    photo_source: photoSource,
  }),
  searchedByImageWithNoResults: (photoSource: PhotoSource): SearchedByImageWithNoResults => ({
    action: ActionType.searchedByImageWithNoResults,
    context_owner_type: OwnerType.searchByImage,
    photo_source: photoSource,
  }),
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
  const { photoUri } = props.route.params

  // Keep cleanup outside Suspense so it also runs when leaving during loading.
  useEffect(() => {
    return () => {
      discardTempPhotos([photoUri])
    }
  }, [photoUri])

  /**
   * Android hardware back should match the header and leave the Lens route instead of popping the
   * inner stack back to the camera. Registered above the Suspense boundary so it covers the loading
   * state too, and returns `true` to keep the stack's own handler from running after it.
   */
  useBackHandler(() => {
    goBack()
    return true
  })

  return (
    <Suspense fallback={<Placeholder onBack={goBack} photoUri={photoUri} />}>
      <LensResults {...props} />
    </Suspense>
  )
}

const Placeholder: React.FC<{ onBack: () => void; photoUri: string }> = ({ onBack, photoUri }) => {
  return (
    <ProvidePlaceholderContext>
      <Screen>
        <LensResultsHeader onBack={onBack} photoUri={photoUri} title={SEARCHING_TITLE} />
        <Screen.Body fullwidth pt={1}>
          <PlaceholderGrid />
        </Screen.Body>
      </Screen>
    </ProvidePlaceholderContext>
  )
}
