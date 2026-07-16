import { OwnerType } from "@artsy/cohesion"
import { Screen, SimpleMessage, Spacer } from "@artsy/palette-mobile"
import { ImageSearchResultsQuery } from "__generated__/ImageSearchResultsQuery.graphql"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

const SCREEN_TITLE = "Visual Search"

interface ImageSearchResultsProps {
  s3Bucket: string
  s3Key: string
}

export const ImageSearchResults: React.FC<ImageSearchResultsProps> = ({ s3Bucket, s3Key }) => {
  const data = useLazyLoadQuery<ImageSearchResultsQuery>(imageSearchResultsQuery, {
    s3Bucket,
    s3Key,
  })

  const artworks = extractNodes(data.artworksByImageConnection)

  return (
    <Screen>
      <Screen.AnimatedHeader title={SCREEN_TITLE} onBack={goBack} />
      <Screen.StickySubHeader title={SCREEN_TITLE} />

      <Screen.Body fullwidth>
        <ArtworksGrid artworks={artworks} />
      </Screen.Body>
    </Screen>
  )
}

const ArtworksGrid: React.FC<{ artworks: any[] }> = ({ artworks }) => {
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
      hasMore={false}
      onScroll={scrollHandler}
    />
  )
}

export const imageSearchResultsQuery = graphql`
  query ImageSearchResultsQuery($s3Bucket: String!, $s3Key: String!) {
    artworksByImageConnection(s3Bucket: $s3Bucket, s3Key: $s3Key, first: 30) {
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
