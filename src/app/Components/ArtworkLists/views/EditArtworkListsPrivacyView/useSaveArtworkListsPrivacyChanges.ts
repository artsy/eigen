import { captureMessage } from "@sentry/react-native"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { ResultAction } from "app/Components/ArtworkLists/types"
import {
  MutationConfig,
  useUpdateArtworkListPrivacy,
} from "app/Components/ArtworkLists/views/EditArtworkListsPrivacyView/useUpdateArtworkListPrivacy"
import { useCallback } from "react"

interface Options {
  onCompleted?: MutationConfig["onCompleted"]
  onError?: MutationConfig["onError"]
}

export const useSaveArtworkListsPrivacyChanges = (options?: Options) => {
  const { shareArtworkListIDs, keepArtworkListPrivateIDs, onSave } = useArtworkListsContext()
  const [commit, inProgress] = useUpdateArtworkListPrivacy()

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
          action: ResultAction.ModifiedArtworkListsPrivacy,
        })

        options?.onCompleted?.(...args)
      },
      onError: (error) => {
        if (__DEV__) {
          console.error(error)
        } else {
          captureMessage(`useUpdateArtworkListPrivacyMutation: ${error.message}`)
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
