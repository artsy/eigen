import { Flex, Text, useColor } from "@artsy/palette-mobile"
import { ContextMenuArtworkPreviewCardImage_artwork$key } from "__generated__/ContextMenuArtworkPreviewCardImage_artwork.graphql"
import {
  ARTWORK_RAIL_CARD_IMAGE_HEIGHT,
  ARTWORK_RAIL_CARD_IMAGE_WIDTH,
} from "app/Components/ArtworkRail/ArtworkRailCardImage"
import { OpaqueImageView } from "app/Components/OpaqueImageView2"
import { sizeToFit } from "app/utils/useSizeToFit"
import { graphql, useFragment } from "react-relay"

const artworkFragment = graphql`
  fragment ContextMenuArtworkPreviewCardImage_artwork on Artwork
  @argumentDefinitions(width: { type: "Int" }) {
    contextMenuImage: image {
      url(version: "large")
      resized(width: $width) {
        src
        srcSet
        width
        height
      }
    }
  }
`

export interface ContextMenuArtworkPreviewCardImageProps {
  artwork: ContextMenuArtworkPreviewCardImage_artwork$key
  urgencyTag?: string | null
  containerWidth?: number
}

export const ContextMenuArtworkPreviewCardImage: React.FC<
  ContextMenuArtworkPreviewCardImageProps
> = ({ urgencyTag = null, containerWidth, ...restProps }) => {
  const artwork = useFragment(artworkFragment, restProps.artwork)
  const color = useColor()

  const { width, height, src } = artwork?.contextMenuImage?.resized || {}

  if (!src) {
    return (
      <Flex
        bg={color("black30")}
        width={width}
        height={ARTWORK_RAIL_CARD_IMAGE_HEIGHT}
        style={{ borderRadius: 2 }}
      />
    )
  }

  const imageDimensions = sizeToFit(
    {
      width: width ?? 0,
      height: height ?? 0,
    },
    {
      width: ARTWORK_RAIL_CARD_IMAGE_WIDTH,
      height: ARTWORK_RAIL_CARD_IMAGE_HEIGHT,
    }
  )

  return (
    <Flex>
      <Flex width={containerWidth}>
        <OpaqueImageView
          style={{ maxHeight: ARTWORK_RAIL_CARD_IMAGE_HEIGHT }}
          imageURL={src}
          height={imageDimensions.height || ARTWORK_RAIL_CARD_IMAGE_HEIGHT}
          width={containerWidth}
        />
      </Flex>
      {!!urgencyTag && (
        <Flex
          backgroundColor={color("white100")}
          position="absolute"
          px="5px"
          py="3px"
          bottom="5px"
          left="5px"
          borderRadius={2}
          alignSelf="flex-start"
        >
          <Text variant="xs" color={color("black100")} numberOfLines={1}>
            {urgencyTag}
          </Text>
        </Flex>
      )}
    </Flex>
  )
}
