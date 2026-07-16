import { OwnerType } from "@artsy/cohesion"
import { Screen, SimpleMessage, Spacer } from "@artsy/palette-mobile"
import { ImageSearchResultsQuery } from "__generated__/ImageSearchResultsQuery.graphql"
import {
  ImageSearchResults_artworks$data,
  ImageSearchResults_artworks$key,
} from "__generated__/ImageSearchResults_artworks.graphql"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { PAGE_SIZE } from "app/Components/constants"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

const SCREEN_TITLE = "Visual Search"

interface ImageSearchResultsProps {
  s3Bucket: string
  s3Key: string
}

export const ImageSearchResults: React.FC<ImageSearchResultsProps> = ({ s3Bucket, s3Key }) => {
  const queryData = useLazyLoadQuery<ImageSearchResultsQuery>(imageSearchResultsQuery, {
    s3Bucket,
    s3Key,
    count: PAGE_SIZE,
  })

  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    ImageSearchResultsQuery,
    ImageSearchResults_artworks$key
  >(artworksFragment, queryData)

  const artworks = extractNodes(data.artworksByImageConnection)

  return (
    <Screen>
      <Screen.AnimatedHeader title={SCREEN_TITLE} onBack={goBack} />
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
  artworks: ExtractNodeType<ImageSearchResults_artworks$data["artworksByImageConnection"]>[]
  hasNext: boolean
  isLoadingNext: boolean
  loadMore: (pageSize: number) => void
}> = ({ artworks, hasNext, isLoadingNext, loadMore }) => {
  const { scrollHandler } = Screen.useListenForScreenScroll()

  return (
    <MasonryInfiniteScrollArtworkGrid
      animated
      artworks={artworks}
      contextScreenOwnerType={OwnerType.search}
      contextScreen={OwnerType.search}
      ListEmptyComponent={
        <SimpleMessage m={2}>
          We couldn’t find any matches for that image. Try another photo.
        </SimpleMessage>
      }
      hasMore={hasNext}
      isLoading={isLoadingNext}
      loadMore={loadMore}
      onScroll={scrollHandler}
    />
  )
}

const artworksFragment = graphql`
  fragment ImageSearchResults_artworks on Query
  @refetchable(queryName: "ImageSearchResultsPaginationQuery")
  @argumentDefinitions(
    s3Bucket: { type: "String!" }
    s3Key: { type: "String!" }
    count: { type: "Int", defaultValue: 30 }
    after: { type: "String" }
  ) {
    artworksByImageConnection(s3Bucket: $s3Bucket, s3Key: $s3Key, first: $count, after: $after)
      @connection(key: "ImageSearchResults_artworksByImageConnection") {
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

export const imageSearchResultsQuery = graphql`
  query ImageSearchResultsQuery($s3Bucket: String!, $s3Key: String!, $count: Int, $after: String) {
    ...ImageSearchResults_artworks
      @arguments(s3Bucket: $s3Bucket, s3Key: $s3Key, count: $count, after: $after)
  }
`

export const ImageSearchResultsScreen: React.FC<ImageSearchResultsProps> = (props) => {
  return (
    <Suspense fallback={<Placeholder />}>
      <ImageSearchResults {...props} />
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
