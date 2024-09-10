import { useSaveArtworkMutation } from "__generated__/useSaveArtworkMutation.graphql"
import { refreshOnArtworkSave } from "app/utils/refreshHelpers"
import { useRef } from "react"
import { Disposable, UseMutationConfig, graphql, useMutation } from "react-relay"

export interface SaveArtworkOptions {
  id: string
  internalID: string
  isSaved: boolean | null
  onCompleted?: (isSaved: boolean) => void
  onError?: (error: Error) => void
  optimisticUpdater?: (
    isSaved: boolean,
    store: Parameters<NonNullable<UseMutationConfig<useSaveArtworkMutation>["updater"]>>[0],
    isCalledBefore: boolean
  ) => void
}

export const useSaveArtwork = ({
  id,
  internalID,
  isSaved,
  onCompleted,
  onError,
  optimisticUpdater,
}: SaveArtworkOptions) => {
  const [commit] = useMutation<useSaveArtworkMutation>(Mutation)
  const prevCommit = useRef<Disposable | null>(null)
  const nextSavedState = !isSaved

  const clearPrevCommit = () => {
    prevCommit.current = null
  }

  return () => {
    let optimisticUpdaterCalledBefore = false

    if (prevCommit.current !== null) {
      prevCommit.current.dispose()
    }

    prevCommit.current = commit({
      variables: {
        artworkID: internalID,
        remove: isSaved,
      },
      onCompleted: () => {
        clearPrevCommit()
        onCompleted?.(nextSavedState)
        refreshOnArtworkSave()
      },
      onError: (error) => {
        clearPrevCommit()
        onError?.(error)
      },
      optimisticUpdater: (store) => {
        const artwork = store.get(id)
        artwork?.setValue(nextSavedState, "isSaved")

        optimisticUpdater?.(nextSavedState, store, optimisticUpdaterCalledBefore)

        /**
         * `optimisticUpdater` can be called twice for the same mutation
         * this flag will help us detect this
         *
         * See this PR for more info: https://github.com/artsy/eigen/pull/8815
         */
        optimisticUpdaterCalledBefore = true
      },
    })
  }
}

const Mutation = graphql`
  mutation useSaveArtworkMutation($artworkID: String!, $remove: Boolean) {
    saveArtwork(input: { artworkID: $artworkID, remove: $remove }) {
      artwork {
        id
        isSaved
        collectorSignals {
          auction {
            lotWatcherCount
          }
        }
      }

      me {
        collection(id: "saved-artwork") {
          internalID
          isSavedArtwork(artworkID: $artworkID)
          ...ArtworkListItem_collection
        }
      }
    }
  }
`
