import { GlobalStore } from "app/store/GlobalStore"
import { DevToggleName } from "app/store/config/features"

export function useDevToggle(key: DevToggleName) {
  return GlobalStore.useAppState((state) => state.artsyPrefs.features.devToggles[key])
}
