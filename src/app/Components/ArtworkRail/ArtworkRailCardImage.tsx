import { Image, Flex } from "@artsy/palette-mobile"
import { ArtworkRailCardImage_artwork$key } from "__generated__/ArtworkRailCardImage_artwork.graphql"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { graphql, useFragment } from "react-relay"

export interface ArtworkRailCardImageProps {
  artwork: ArtworkRailCardImage_artwork$key
}
export const ARTWORK_RAIL_CARD_IMAGE_HEIGHT = 215

export const ARTWORK_RAIL_CARD_MIN_WIDTH = 140
export const ARTWORK_RAIL_CARD_MAX_WIDTH = 340

const PADDING = 10

export const ArtworkRailCardImage: React.FC<ArtworkRailCardImageProps> = ({ ...restProps }) => {
  const showBlurhash = useFeatureFlag("ARShowBlurhashImagePlaceholder")
  const artwork = useFragment(artworkFragment, restProps.artwork)

  const { image } = artwork

  const useImageDimentions = () => {
    const imageAspectRatio =
      image?.aspectRatio ?? (image?.width && image?.height ? image.width / image.height : 1)

    const imageWidth = ARTWORK_RAIL_CARD_IMAGE_HEIGHT * imageAspectRatio

    let containerWidth = imageWidth
    let horizontalPadding = 0
    let verticalPadding = 0

    // Case when the image width is narrower than the maximum width
    if (imageWidth <= ARTWORK_RAIL_CARD_MIN_WIDTH) {
      containerWidth = ARTWORK_RAIL_CARD_MIN_WIDTH
      verticalPadding = PADDING
    }

    // Case when the image width is wider than the maximum width
    if (imageWidth >= ARTWORK_RAIL_CARD_MAX_WIDTH) {
      containerWidth = ARTWORK_RAIL_CARD_MAX_WIDTH
      horizontalPadding = PADDING
    }

    const displayImageWidth =
      imageWidth <= ARTWORK_RAIL_CARD_MIN_WIDTH
        ? Math.min(imageWidth, ARTWORK_RAIL_CARD_MIN_WIDTH) - 2 * horizontalPadding
        : Math.min(Math.max(imageWidth, ARTWORK_RAIL_CARD_MIN_WIDTH), ARTWORK_RAIL_CARD_MAX_WIDTH) -
          2 * horizontalPadding

    const displayImageHeight =
      Math.min(displayImageWidth / imageAspectRatio, ARTWORK_RAIL_CARD_IMAGE_HEIGHT) -
      2 * verticalPadding

    return { containerWidth, displayImageWidth, displayImageHeight }
  }

  const { containerWidth, displayImageWidth, displayImageHeight } = useImageDimentions()

  return (
    <Flex
      backgroundColor="mono5"
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
          resizeMode="cover"
          testID="artwork-rail-card-image"
        />
      )}
    </Flex>
  )
}

const artworkFragment = graphql`
  fragment ArtworkRailCardImage_artwork on Artwork {
    image(includeAll: false) {
      blurhash
      url(version: ["larger", "large", "medium", "small", "square"])
      aspectRatio
      width
      height
    }
  }
`
