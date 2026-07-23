import { ContextModule, ScreenOwnerType } from "@artsy/cohesion"
import { Flex, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { ArtworkGridItem_artwork$data } from "__generated__/ArtworkGridItem_artwork.graphql"
import ArtworkGridItem, {
  ArtworkProps,
  PriceOfferMessage,
} from "app/Components/ArtworkGrids/ArtworkGridItem"
import { useGridItemVisibility } from "app/Components/ArtworkGrids/useGridItemVisibility"
import { PartnerOffer } from "app/Scenes/Activity/components/PartnerOfferCreatedNotification"
import { Sentinel } from "app/utils/Sentinel"
import { NUM_COLUMNS_MASONRY } from "app/utils/masonryHelpers"
import { useRef } from "react"
import { View, ViewProps } from "react-native"
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
   * Whether this grid needs repeatable visibility detection (i.e. NWFY) — items that stay on
   * screen across a live refresh re-fire onItemVisibilityChange, via useGridItemVisibility instead
   * of the shared Sentinel, which only ever fires its first "true" transition (fine for one-shot
   * consumers elsewhere). Leave undefined to keep the default Sentinel-based behavior.
   */
  useLiveVisibilityTracking?: boolean
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
  useLiveVisibilityTracking,
  ...rest
}) => {
  const space = useSpace()
  const { width } = useScreenDimensions()

  const imgAspectRatio = item.image?.aspectRatio ?? 1
  // No paddings are needed for single column grids
  const imgWidth = numColumns === 1 ? width : width / numColumns - space(2) - space(1)
  const imgHeight = imgWidth / imgAspectRatio

  const contentRef = useRef<View>(null)
  const usesGridItemVisibility = !!onItemVisibilityChange && !!useLiveVisibilityTracking

  // Measures the existing content Flex directly (via `ref` below) rather than an extra wrapping
  // View — an earlier version wrapped the content in its own View to get a real height to measure,
  // but that confused FlashList's masonry column-height measurement and pushed later items off
  // screen. Called unconditionally (rules of hooks); it's a no-op unless `usesGridItemVisibility`.
  useGridItemVisibility({
    ref: contentRef,
    threshold: 0.5,
    enabled: usesGridItemVisibility,
    onVisibilityChange: (visible) => {
      onItemVisibilityChange?.(item.internalID || item.id, index, visible)
    },
  })

  return (
    <>
      <Flex
        ref={contentRef}
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
      {!!onItemVisibilityChange && !usesGridItemVisibility && (
        <Sentinel
          threshold={0.5}
          onChange={(visible) => onItemVisibilityChange(item.internalID || item.id, index, visible)}
        />
      )}
    </>
  )
}
