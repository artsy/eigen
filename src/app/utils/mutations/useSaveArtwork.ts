import { useSaveArtworkMutation } from "__generated__/useSaveArtworkMutation.graphql"
import { useMutation } from "react-relay"
import { RecordSourceSelectorProxy, graphql } from "relay-runtime"

export interface SaveArtworkOptions {
  id: string
  internalID: string
  isSaved: boolean | null
  onCompleted?: (isSaved: boolean) => void
  onError?: () => void
  optimisticUpdater?: (isSaved: boolean, store: RecordSourceSelectorProxy) => void
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
  const nextSavedState = !isSaved

  return () => {
    let optimisticUpdaterCalledBefore = false

    commit({
      variables: {
        artworkID: internalID,
        remove: isSaved,
      },
      onCompleted: () => {
        onCompleted?.(nextSavedState)
      },
      onError,
      optimisticUpdater: (store) => {
        /**
         * `optimisticUpdater` can be called twice for the same mutation
         * this hack helps prevent this from happening
         *
         * See this PR for more info: https://github.com/artsy/eigen/pull/8815
         */
        if (optimisticUpdaterCalledBefore) {
          return
        }

        const artwork = store.get(id)
        artwork?.setValue(nextSavedState, "isSaved")

        optimisticUpdater?.(nextSavedState, store)
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
