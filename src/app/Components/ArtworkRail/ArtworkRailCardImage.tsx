import { Image, Flex, useColor } from "@artsy/palette-mobile"
import { ArtworkRailCardImage_artwork$key } from "__generated__/ArtworkRailCardImage_artwork.graphql"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { graphql, useFragment } from "react-relay"

export interface ArtworkRailCardImageProps {
  artwork: ArtworkRailCardImage_artwork$key
}
export const CONTAINER_HEIGHT = 215
export const MIN_IMAGE_WIDTH = 140
export const MAX_IMAGE_WIDTH = 340
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

export const ArtworkRailCardImage: React.FC<ArtworkRailCardImageProps> = ({ ...restProps }) => {
  const showBlurhash = useFeatureFlag("ARShowBlurhashImagePlaceholder")
  const artwork = useFragment(artworkFragment, restProps.artwork)
  const color = useColor()
  //  const { image } = artwork

  const image = tallImage
  if (!artwork?.image || !image?.url || !image?.aspectRatio) {
    return (
      <Flex
        bg={color("black30")}
        width={MIN_IMAGE_WIDTH}
        height={CONTAINER_HEIGHT}
        style={{ borderRadius: 2 }}
      />
    )
  }

  const imageWidth = CONTAINER_HEIGHT * image?.aspectRatio

  let containerWidth = imageWidth
  let horizontalPadding = 0
  let verticalPadding = 0
  let imageDisplayWidth = 0
  let imageDisplayHeight = 0

  if (imageWidth <= MIN_IMAGE_WIDTH) {
    containerWidth = MIN_IMAGE_WIDTH
    verticalPadding = PADDING
    imageDisplayHeight = CONTAINER_HEIGHT - 2 * verticalPadding
    imageDisplayWidth = imageDisplayHeight * image.aspectRatio
  }

  // Case when the image width is wider than the maximum width
  if (imageWidth >= MAX_IMAGE_WIDTH) {
    containerWidth = MAX_IMAGE_WIDTH
    horizontalPadding = PADDING
    imageDisplayWidth = MAX_IMAGE_WIDTH - 2 * horizontalPadding
    imageDisplayHeight = imageDisplayWidth / image.aspectRatio
  }

  return (
    <Flex
      backgroundColor="black5"
      justifyContent="center"
      alignItems="center"
      height={CONTAINER_HEIGHT}
      width={containerWidth}
    >
      <Image
        src={image.url}
        width={imageDisplayWidth}
        height={imageDisplayHeight}
        aspectRatio={image.aspectRatio}
        blurhash={showBlurhash ? image.blurhash : undefined}
        performResize={false}
        resizeMode="contain"
      />
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
