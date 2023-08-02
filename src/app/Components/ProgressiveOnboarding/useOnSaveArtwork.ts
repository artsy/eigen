import { GlobalStore } from "app/store/GlobalStore"
import { useCallback } from "react"

export const useOnSaveArtwork = () => {
  const { setTabProps } = GlobalStore.actions.bottomTabs
  const { tabProps } = GlobalStore.useAppState((state) => state.bottomTabs.sessionState)

  const updateProfileTab = useCallback(() => {
    setTabProps({ tab: "profile", props: { ...tabProps.profile, savedArtwork: true } })
  }, [tabProps.profile?.savedArtwork, setTabProps])

  return { updateProfileTab }
}
