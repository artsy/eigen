import { captureMessage } from "@sentry/react-native"
import { ArtworkListsStore } from "app/Components/ArtworkLists/ArtworkListsStore"
import { useArtworkListToast } from "app/Components/ArtworkLists/useArtworkListsToast"
import {
  MutationConfig,
  useUpdateArtworkListOfferSettings,
} from "app/Components/ArtworkLists/views/ArtworkListOfferSettingsView/useUpdateArtworkListOfferSettings"
import { useCallback } from "react"

interface Options {
  onCompleted?: MutationConfig["onCompleted"]
  onError?: MutationConfig["onError"]
}

export const useSaveArtworkListsOfferSettingsChanges = (options?: Options) => {
  const toast = useArtworkListToast()
  const { shareArtworkListIDs, keepArtworkListPrivateIDs } = ArtworkListsStore.useStoreState(
    (state) => ({
      shareArtworkListIDs: state.shareArtworkListIDs,
      keepArtworkListPrivateIDs: state.keepArtworkListPrivateIDs,
    })
  )
  const setUnsavedChanges = ArtworkListsStore.useStoreActions(
    (actions) => actions.setUnsavedChanges
  )
  const [commit, inProgress] = useUpdateArtworkListOfferSettings()

  const save = useCallback(() => {
    commit({
      variables: {
        input: {
          attributes: [
            ...shareArtworkListIDs.map((id) => ({ id, shareableWithPartners: true })),
            ...keepArtworkListPrivateIDs.map((id) => ({ id, shareableWithPartners: false })),
          ],
        },
      },
      onCompleted: (...args) => {
        toast.changesSaved()
        setUnsavedChanges(false)

        options?.onCompleted?.(...args)
      },
      onError: (error) => {
        if (__DEV__) {
          console.error(error)
        } else {
          captureMessage(`useUpdateArtworkListOfferSettingsMutation: ${error.message}`)
        }

        options?.onError?.(error)
      },
    })
  }, [shareArtworkListIDs, keepArtworkListPrivateIDs])

  return {
    save,
    inProgress,
  }
}
