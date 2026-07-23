import { ContextModule, ScreenOwnerType } from "@artsy/cohesion"
import { Flex, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { ArtworkGridItem_artwork$data } from "__generated__/ArtworkGridItem_artwork.graphql"
import ArtworkGridItem, {
  ArtworkProps,
  PriceOfferMessage,
} from "app/Components/ArtworkGrids/ArtworkGridItem"
import { GridItemVisibilitySentinel } from "app/Components/ArtworkGrids/GridItemVisibilitySentinel"
import { PartnerOffer } from "app/Scenes/Activity/components/PartnerOfferCreatedNotification"
import { Sentinel } from "app/utils/Sentinel"
import { NUM_COLUMNS_MASONRY } from "app/utils/masonryHelpers"
import { ViewProps } from "react-native"
import { FragmentRefs } from "relay-runtime"

interface Artwork {
  readonly id: string
  readonly internalID?: string | null
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
  fullWidth?: boolean
  artworkMetaStyle?: ViewProps["style"]
  contextModule?: ContextModule
  contextScreen?: ScreenOwnerType
  contextScreenOwnerId?: string
  contextScreenOwnerSlug?: string
  contextScreenOwnerType?: ScreenOwnerType
  index: number
  item: Artwork
  numColumns?: number
  onPress?: (artworkID: string, artwork?: ArtworkGridItem_artwork$data, itemIndex?: number) => void
  partnerOffer?: PartnerOffer | null
  priceOfferMessage?: PriceOfferMessage
  hideSaveIcon?: boolean
  hideSaleInfo?: boolean
  fitToFrame?: boolean
  /**
   * Called when this artwork enters/leaves the viewport.
   * Use for impression tracking in nested, non-scroll grids.
   */
  onItemVisibilityChange?: (artworkInternalID: string, index: number, visible: boolean) => void
  /**
   * Bump to force this item to re-report its current visibility (e.g. after a live refresh).
   * Only meaningful together with onItemVisibilityChange. When provided (including `0`), visibility
   * is tracked via GridItemVisibilitySentinel, which supports repeat detection, instead of the
   * shared Sentinel, which only ever fires its first "true" transition — fine for one-shot
   * consumers elsewhere, but not for a grid that needs to re-track already-visible items after a
   * refresh. Leave undefined to keep the default Sentinel-based behavior.
   */
  refreshKey?: number
}

export const MasonryArtworkGridItem: React.FC<MasonryArtworkGridItemProps> = ({
  fullWidth = false,
  artworkMetaStyle = {},
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
  onItemVisibilityChange,
  refreshKey,
  ...rest
}) => {
  const space = useSpace()
  const { width } = useScreenDimensions()

  const imgAspectRatio = item.image?.aspectRatio ?? 1
  // No paddings are needed for single column grids
  const imgWidth = numColumns === 1 ? width : width / numColumns - space(2) - space(1)
  const imgHeight = imgWidth / imgAspectRatio

  return (
    <>
      <Flex
        left={
          fullWidth
            ? // When displayed full width, we want artworks to be displayed full width
              // Therefore, we need to remove the padding that comes from artwork grid item
              -space(1)
            : 0
        }
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
        />
      </Flex>
      {!!onItemVisibilityChange &&
        (refreshKey !== undefined ? (
          <GridItemVisibilitySentinel
            threshold={0.5}
            refreshKey={refreshKey}
            onVisibilityChange={(visible) =>
              onItemVisibilityChange(item.internalID || item.id, index, visible)
            }
          />
        ) : (
          <Sentinel
            threshold={0.5}
            onChange={(visible) =>
              onItemVisibilityChange(item.internalID || item.id, index, visible)
            }
          />
        ))}
    </>
  )
}
