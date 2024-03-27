import { captureMessage } from "@sentry/react-native"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { ResultAction } from "app/Components/ArtworkLists/types"
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
  const { shareArtworkListIDs, keepArtworkListPrivateIDs, onSave } = useArtworkListsContext()
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
        onSave({
          action: ResultAction.ModifiedArtworkListsOfferSettings,
        })

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
