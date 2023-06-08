import { useRef } from "react"
import { useMutation } from "react-relay"
import { Disposable, graphql } from "relay-runtime"

export interface SaveArtworkOptions {
  id: string
  internalID: string
  isSaved: boolean | null
  onCompleted?: (isSaved: boolean) => void
  onError?: (error: Error) => void
}

export const useSaveArtwork = ({
  id,
  internalID,
  isSaved,
  onCompleted,
  onError,
}: SaveArtworkOptions) => {
  const [commit] = useMutation(Mutation)
  const prevCommit = useRef<Disposable | null>(null)
  const nextSavedState = !isSaved

  const clearPrevCommit = () => {
    prevCommit.current = null
  }

  return () => {
    if (prevCommit.current !== null) {
      prevCommit.current.dispose()
    }

    prevCommit.current = commit({
      variables: {
        input: {
          artworkID: internalID,
          remove: isSaved,
        },
      },
      onCompleted: () => {
        clearPrevCommit()
        onCompleted?.(nextSavedState)
      },
      onError: (error) => {
        clearPrevCommit()
        onError?.(error)
      },
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
