import { GlobalStore } from "app/store/GlobalStore"
import { FeatureName } from "app/store/config/features"

export function useFeatureFlag(key: FeatureName) {
  return GlobalStore.useAppState((state) => state.artsyPrefs.features.flags[key])
}
