import { ContextModule, ScreenOwnerType } from "@artsy/cohesion"
import { Flex, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { ArtworkGridItem_artwork$data } from "__generated__/ArtworkGridItem_artwork.graphql"
import ArtworkGridItem, {
  ArtworkProps,
  PriceOfferMessage,
} from "app/Components/ArtworkGrids/ArtworkGridItem"
import { PartnerOffer } from "app/Scenes/Activity/components/PartnerOfferCreatedNotification"
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

interface MasonryArtworkGridItemProps extends Omit<ArtworkProps, "artwork"> {
  artworkMetaStyle?: ViewProps["style"]
  columnIndex: number
  contextModule?: ContextModule
  contextScreen?: ScreenOwnerType
  contextScreenOwnerId?: string
  contextScreenOwnerSlug?: string
  contextScreenOwnerType?: ScreenOwnerType
  index: number
  item: Artwork
  numColumns?: number
  onPress?: (artworkID: string, artwork?: ArtworkGridItem_artwork$data) => void
  partnerOffer?: PartnerOffer | null
  priceOfferMessage?: PriceOfferMessage
  hideSaveIcon?: boolean
  hideSaleInfo?: boolean
  hideArtworMetaData?: boolean
}

export const MasonryArtworkGridItem: React.FC<MasonryArtworkGridItemProps> = ({
  artworkMetaStyle = {},
  columnIndex,
  contextModule,
  contextScreen,
  contextScreenOwnerId,
  contextScreenOwnerSlug,
  contextScreenOwnerType,
  index,
  item,
  numColumns = NUM_COLUMNS_MASONRY,
  onPress,
  partnerOffer,
  priceOfferMessage,
  hideArtworMetaData = false,
  ...rest
}) => {
  const space = useSpace()
  const { width } = useScreenDimensions()

  const imgAspectRatio = item.image?.aspectRatio ?? 1
  // No paddings are needed for single column grids
  const imgWidth =
    numColumns === 1 ? width : width / numColumns - (hideArtworMetaData ? 0 : space(2) - space(1))
  const imgHeight = imgWidth / imgAspectRatio

  return (
    <Flex
      pl={hideArtworMetaData ? 0 : columnIndex === 0 ? 0 : 1}
      pr={hideArtworMetaData ? 0 : numColumns - (columnIndex + 1) === 0 ? 0 : 1}
      mt={hideArtworMetaData ? 0 : 2}
    >
      <ArtworkGridItem
        {...rest}
        artwork={item}
        artworkMetaStyle={artworkMetaStyle}
        contextModule={contextModule}
        contextScreen={contextScreen}
        contextScreenOwnerId={contextScreenOwnerId}
        contextScreenOwnerSlug={contextScreenOwnerSlug}
        contextScreenOwnerType={contextScreenOwnerType}
        height={imgHeight}
        itemIndex={index}
        onPress={onPress}
        partnerOffer={partnerOffer}
        priceOfferMessage={priceOfferMessage}
        hideArtworMetaData={hideArtworMetaData}
      />
    </Flex>
  )
}
