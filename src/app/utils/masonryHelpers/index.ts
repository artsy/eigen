import { isTablet } from "react-native-device-info"

// https://shopify.github.io/flash-list/docs/fundamentals/performant-components#estimateditemsize
export const ESTIMATED_MASONRY_ITEM_SIZE = 272

export const NUM_COLUMNS_MASONRY = isTablet() ? 3 : 2

export const ON_END_REACHED_THRESHOLD_MASONRY = 0.3
