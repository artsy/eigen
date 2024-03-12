import { ScreenOwnerType } from "@artsy/cohesion"
import { Flex, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import ArtworkGridItem, { PriceOfferMessage } from "app/Components/ArtworkGrids/ArtworkGridItem"
import { NUM_COLUMNS_MASONRY } from "app/utils/masonryHelpers"
import { ViewProps } from "react-native"
import { FragmentRefs } from "relay-runtime"

interface Artwork {
  readonly id: string
  readonly image:
    | {
        readonly aspectRatio: number
      }
    | null
    | undefined
  readonly slug: string
  readonly " $fragmentSpreads": FragmentRefs<"ArtworkGridItem_artwork">
}

interface MasonryArtworkGridItemProps {
  item: Artwork
  index: number
  columnIndex: number
  contextScreenOwnerType?: ScreenOwnerType
  contextScreen?: ScreenOwnerType
  contextScreenOwnerId?: string
  contextScreenOwnerSlug?: string
  numColumns?: number
  artworkMetaStyle?: ViewProps["style"]
  priceOfferMessage?: PriceOfferMessage
}

export const MasonryArtworkGridItem: React.FC<MasonryArtworkGridItemProps> = ({
  item,
  index,
  columnIndex,
  contextScreenOwnerType,
  contextScreenOwnerId,
  contextScreenOwnerSlug,
  contextScreen,
  numColumns = NUM_COLUMNS_MASONRY,
  artworkMetaStyle = {},
  priceOfferMessage,
  ...rest
}) => {
  const space = useSpace()
  const { width } = useScreenDimensions()

  const imgAspectRatio = item.image?.aspectRatio ?? 1
  // No paddings are needed for single column grids
  const imgWidth = numColumns === 1 ? width : width / numColumns - space(2) - space(1)
  const imgHeight = imgWidth / imgAspectRatio

  return (
    <Flex pl={columnIndex === 0 ? 0 : 1} pr={numColumns - (columnIndex + 1) === 0 ? 0 : 1} mt={2}>
      <ArtworkGridItem
        {...rest}
        itemIndex={index}
        contextScreenOwnerType={contextScreenOwnerType}
        contextScreenOwnerId={contextScreenOwnerId}
        contextScreenOwnerSlug={contextScreenOwnerSlug}
        contextScreen={contextScreen}
        artwork={item}
        height={imgHeight}
        artworkMetaStyle={artworkMetaStyle}
        priceOfferMessage={priceOfferMessage}
      />
    </Flex>
  )
}
