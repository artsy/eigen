import { GlobalStore } from "app/store/GlobalStore"
import { NUM_COLUMNS_MASONRY } from "app/utils/masonryHelpers"

export const useViewOptionNumColumns = () => {
  const defaultViewOption = GlobalStore.useAppState((state) => state.userPrefs.defaultViewOption)

  return defaultViewOption === "grid" ? NUM_COLUMNS_MASONRY : 1
}
