import { Flex } from "@artsy/palette-mobile"
import { ActivityIndicator, Platform } from "react-native"
import { isTablet } from "react-native-device-info"
import { FragmentRefs } from "relay-runtime"

// https://shopify.github.io/flash-list/docs/fundamentals/performant-components#estimateditemsize
export const ESTIMATED_MASONRY_ITEM_SIZE = 272

export const NUM_COLUMNS_MASONRY = isTablet() ? 3 : 2

export const ON_END_REACHED_THRESHOLD_MASONRY = 0.3

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

interface MasonryListFooterComponentProps {
  shouldDisplaySpinner: boolean
}

export const MasonryListFooterComponent: React.FC<MasonryListFooterComponentProps> = ({
  shouldDisplaySpinner,
}) =>
  shouldDisplaySpinner ? (
    <Flex width="100%" position="absolute">
      <Flex mt={2}>
        <ActivityIndicator color={Platform.OS === "android" ? "black" : undefined} />
      </Flex>
    </Flex>
  ) : null
