import { Flex, Image, useColor, useScreenDimensions } from "@artsy/palette-mobile"
import { ContextMenuArtworkPreviewCardImage_artwork$key } from "__generated__/ContextMenuArtworkPreviewCardImage_artwork.graphql"
import { graphql, useFragment } from "react-relay"

const ARTWORK_PREVIEW_IMAGE_MIN_HEIGHT = 50

export interface ContextMenuArtworkPreviewCardImageProps {
  artwork: ContextMenuArtworkPreviewCardImage_artwork$key
  containerWidth: number
  containerHeight?: number
}

export const ContextMenuArtworkPreviewCardImage: React.FC<
  ContextMenuArtworkPreviewCardImageProps
> = ({ containerWidth, containerHeight: _containerHeight, ...restProps }) => {
  const artwork = useFragment(artworkFragment, restProps.artwork)
  const color = useColor()

  const aspectRatio = artwork?.contextMenuImage?.aspectRatio
  const { width, height, src } = artwork?.contextMenuImage?.resized || {}

  const { height: screenHeight } = useScreenDimensions()

  const useImageDimensions = () => {
    const imageAspectRatio = aspectRatio ?? (width && height ? width / height : 1)

    // Check if this is a narrow image and we have containerHeight prop
    const isNarrowImage = imageAspectRatio < 1
    const useProvidedHeight = isNarrowImage && _containerHeight

    if (useProvidedHeight) {
      // For narrow images with provided height: use the height and calculate width
      const displayImageHeight = _containerHeight
      const displayImageWidth = displayImageHeight * imageAspectRatio
      return { containerHeight: _containerHeight, displayImageWidth, displayImageHeight }
    } else {
      // For flat images: use existing logic (width-driven)
      const imageWidth = containerWidth
      const imageHeight = imageWidth / imageAspectRatio

      const maxHeight = Math.floor(screenHeight / 2)

      let calculatedContainerHeight = imageHeight

      // Case when the image height is less than the minimum height
      if (imageHeight <= ARTWORK_PREVIEW_IMAGE_MIN_HEIGHT) {
        calculatedContainerHeight = ARTWORK_PREVIEW_IMAGE_MIN_HEIGHT
      }

      // Case when the image height exceeds the maximum height
      if (imageHeight >= maxHeight) {
        calculatedContainerHeight = maxHeight
      }

      const displayImageHeight =
        imageHeight <= ARTWORK_PREVIEW_IMAGE_MIN_HEIGHT
          ? Math.min(imageHeight, ARTWORK_PREVIEW_IMAGE_MIN_HEIGHT)
          : Math.min(Math.max(imageHeight, ARTWORK_PREVIEW_IMAGE_MIN_HEIGHT), maxHeight)

      const displayImageWidth = Math.min(displayImageHeight * imageAspectRatio, imageWidth)

      return { containerHeight: calculatedContainerHeight, displayImageWidth, displayImageHeight }
    }
  }

  const { containerHeight, displayImageWidth, displayImageHeight } = useImageDimensions()

  if (!src) {
    return (
      <Flex
        bg={color("mono30")}
        width={containerWidth}
        height={ARTWORK_PREVIEW_IMAGE_MIN_HEIGHT}
        style={{ borderRadius: 2 }}
      />
    )
  }

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      height={containerHeight}
      width={containerWidth}
    >
      {!!src && (
        <Image
          src={src}
          width={displayImageWidth}
          height={displayImageHeight}
          performResize={false}
          resizeMode="cover"
          testID="artwork-rail-card-image"
        />
      )}
    </Flex>
  )
}

const artworkFragment = graphql`
  fragment ContextMenuArtworkPreviewCardImage_artwork on Artwork
  @argumentDefinitions(width: { type: "Int" }) {
    contextMenuImage: image {
      url(version: ["larger", "large", "medium", "small", "square"])
      aspectRatio
      resized(width: $width) {
        src
        srcSet
        width
        height
      }
    }
  }
`
