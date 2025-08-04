import { isTablet } from "react-native-device-info"
import { FragmentRefs } from "relay-runtime"

// https://shopify.github.io/flash-list/docs/fundamentals/performant-components#estimateditemsize
export const ESTIMATED_MASONRY_ITEM_SIZE = 272

export const NUM_COLUMNS_MASONRY = isTablet() ? 3 : 2

export const ON_END_REACHED_THRESHOLD_MASONRY = 2

export const MASONRY_LIST_PAGE_SIZE = 10

export interface masonryRenderItemProps {
  item: MasonryArtworkItem
  index: number
  columnIndex: number
}

export interface MasonryArtworkItem {
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
