import { GlobalStore } from "app/store/GlobalStore"

export function useIsStaging() {
  return GlobalStore.useAppState((state) => state.devicePrefs.environment.env === "staging")
}
