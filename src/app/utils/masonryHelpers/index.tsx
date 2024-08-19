import { Flex, Spinner } from "@artsy/palette-mobile"
import { motify } from "moti"
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

const MotiFlex = motify(Flex)()

export const AnimatedMasonryListFooterComponent: React.FC<MasonryListFooterComponentProps> = ({
  shouldDisplaySpinner,
}) => {
  return (
    <MotiFlex
      my={4}
      flexDirection="row"
      justifyContent="center"
      from={{ opacity: shouldDisplaySpinner ? 1 : 0 }}
    >
      <Spinner />
    </MotiFlex>
  )
}
