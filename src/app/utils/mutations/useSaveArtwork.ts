import { useMutation } from "react-relay"
import { graphql } from "relay-runtime"

export interface SaveArtworkOptions {
  id: string
  internalID: string
  isSaved: boolean | null
  onCompleted?: (isSaved: boolean) => void
  onError?: () => void
}

export const useSaveArtwork = ({
  id,
  internalID,
  isSaved,
  onCompleted,
  onError,
}: SaveArtworkOptions) => {
  const [commit] = useMutation(Mutation)
  const nextSavedState = !isSaved

  return () => {
    commit({
      variables: {
        input: {
          artworkID: internalID,
          remove: isSaved,
        },
      },
      onCompleted: () => {
        onCompleted?.(nextSavedState)
      },
      onError,
      optimisticUpdater: (store) => {
        const artwork = store.get(id)
        artwork?.setValue(nextSavedState, "isSaved")
      },
    })
  }
}

const Mutation = graphql`
  mutation useSaveArtworkMutation($input: SaveArtworkInput!) {
    saveArtwork(input: $input) {
      artwork {
        id
        isSaved
      }

      me {
        collection(id: "saved-artwork") {
          internalID
          ...ArtworkListItem_collection
        }
      }
    }
  }
`
