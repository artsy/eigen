import { LOCALIZED_UNIT } from "app/Components/ArtworkFilter/Filters/helpers"
import { GlobalStore } from "app/store/GlobalStore"

export const useLocalizedUnit = () => {
  const userPreferredMetric =
    GlobalStore.useAppState((state) => state.userPrefs.metric) || LOCALIZED_UNIT

  return {
    localizedUnit: userPreferredMetric,
  }
}
