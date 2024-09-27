import { Image, Flex } from "@artsy/palette-mobile"
import { ArtworkRailCardImage_artwork$key } from "__generated__/ArtworkRailCardImage_artwork.graphql"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { graphql, useFragment } from "react-relay"

export interface ArtworkRailCardImageProps {
  artwork: ArtworkRailCardImage_artwork$key
}
export const ARTWORK_RAIL_CARD_IMAGE_HEIGHT = 215
export const ARTWORK_RAIL_MIN_IMAGE_WIDTH = 140
export const ARTWORK_RAIL_MAX_IMAGE_WIDTH = 340
const PADDING = 10

// Take
const tallImage = {
  aspectRatio: 0.3,
  height: 3000,
  url: "https://d32dm0rphc51dk.cloudfront.net/IIPB-7WL_QaSV9sqORf0TQ/large.jpg",
  width: 911,
}

const wideImage = {
  aspectRatio: 2.81,
  height: 356,
  url: "https://d32dm0rphc51dk.cloudfront.net/nELDUsRuQl5DLM-WedfSMQ/large.jpg",
  width: 1000,
}

/* const wideImage = {
  aspectRatio: 2.28,
  height: 1768,
  url: "https://d32dm0rphc51dk.cloudfront.net/3PjwqKQuAqp1ZcgEro4qbg/large.jpg",
  width: 4030,
} */
export const ArtworkRailCardImage: React.FC<ArtworkRailCardImageProps> = ({ ...restProps }) => {
  const showBlurhash = useFeatureFlag("ARShowBlurhashImagePlaceholder")
  const artwork = useFragment(artworkFragment, restProps.artwork)

  const { image } = artwork

  // const image = wideImage

  const useImageDimentions = () => {
    if (!image?.aspectRatio) {
      return { containerWidth: 0 }
    }

    const imageWidth = ARTWORK_RAIL_CARD_IMAGE_HEIGHT * image?.aspectRatio

    let containerWidth = imageWidth
    let horizontalPadding = 0
    let verticalPadding = 0

    // Case when the image width is narrower than the maximum width
    if (imageWidth <= ARTWORK_RAIL_MIN_IMAGE_WIDTH) {
      containerWidth = ARTWORK_RAIL_MIN_IMAGE_WIDTH
      verticalPadding = PADDING
    }

    // Case when the image width is wider than the maximum width
    if (imageWidth >= ARTWORK_RAIL_MAX_IMAGE_WIDTH) {
      containerWidth = ARTWORK_RAIL_MAX_IMAGE_WIDTH
      horizontalPadding = PADDING
    }

    const displayImageWidth =
      imageWidth <= ARTWORK_RAIL_MIN_IMAGE_WIDTH
        ? Math.min(imageWidth, ARTWORK_RAIL_MIN_IMAGE_WIDTH) - 2 * horizontalPadding
        : Math.min(
            Math.max(imageWidth, ARTWORK_RAIL_MIN_IMAGE_WIDTH),
            ARTWORK_RAIL_MAX_IMAGE_WIDTH
          ) -
          2 * horizontalPadding

    const displayImageHeight =
      Math.min(displayImageWidth / image.aspectRatio, ARTWORK_RAIL_CARD_IMAGE_HEIGHT) -
      2 * verticalPadding

    return { containerWidth, displayImageWidth, displayImageHeight }
  }

  const { containerWidth, displayImageWidth, displayImageHeight } = useImageDimentions()

  return (
    <Flex
      backgroundColor="black5"
      justifyContent="center"
      alignItems="center"
      height={ARTWORK_RAIL_CARD_IMAGE_HEIGHT}
      width={containerWidth}
    >
      {!!image?.url && (
        <Image
          src={image.url}
          width={displayImageWidth}
          height={displayImageHeight}
          aspectRatio={image.aspectRatio}
          blurhash={showBlurhash ? image.blurhash : undefined}
          performResize={false}
          resizeMode="contain"
        />
      )}
    </Flex>
  )
}

const artworkFragment = graphql`
  fragment ArtworkRailCardImage_artwork on Artwork {
    image(includeAll: false) {
      blurhash
      url(version: "large")
      aspectRatio
    }
  }
`
