import { Flex, Image, useColor } from "@artsy/palette-mobile"
import { ContextMenuArtworkPreviewCardImage_artwork$key } from "__generated__/ContextMenuArtworkPreviewCardImage_artwork.graphql"
import {
  LEGACY_ARTWORK_RAIL_CARD_IMAGE_HEIGHT,
  ARTWORK_RAIL_CARD_IMAGE_WIDTH,
} from "app/Components/ArtworkRail/LegacyArtworkRailCardImage"
import { sizeToFit } from "app/utils/useSizeToFit"
import { graphql, useFragment } from "react-relay"

const artworkFragment = graphql`
  fragment ContextMenuArtworkPreviewCardImage_artwork on Artwork
  @argumentDefinitions(width: { type: "Int" }) {
    contextMenuImage: image {
      url(version: ["larger", "large", "medium", "small", "square"])
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
  containerWidth?: number
}

export const ContextMenuArtworkPreviewCardImage: React.FC<
  ContextMenuArtworkPreviewCardImageProps
> = ({ containerWidth, ...restProps }) => {
  const artwork = useFragment(artworkFragment, restProps.artwork)
  const color = useColor()

  const { width, height, src } = artwork?.contextMenuImage?.resized || {}

  if (!src) {
    return (
      <Flex
        bg={color("black30")}
        width={width}
        height={LEGACY_ARTWORK_RAIL_CARD_IMAGE_HEIGHT}
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
      height: LEGACY_ARTWORK_RAIL_CARD_IMAGE_HEIGHT,
    }
  )

  return (
    <Flex>
      <Flex width={containerWidth}>
        <Image
          style={{ maxHeight: LEGACY_ARTWORK_RAIL_CARD_IMAGE_HEIGHT }}
          src={src}
          height={imageDimensions.height || LEGACY_ARTWORK_RAIL_CARD_IMAGE_HEIGHT}
          width={containerWidth}
        />
      </Flex>
    </Flex>
  )
}
