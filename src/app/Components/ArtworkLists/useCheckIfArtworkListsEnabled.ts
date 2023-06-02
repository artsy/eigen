import { GlobalStore } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

export const useCheckIfArtworkListsEnabled = () => {
  const isArtsyEmployee = GlobalStore.useAppState((store) => store.auth.userHasArtsyEmail)
  const isArtworkListsEnabled = useFeatureFlag("AREnableArtworkLists")

  return isArtsyEmployee && isArtworkListsEnabled
}
