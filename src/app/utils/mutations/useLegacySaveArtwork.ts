import { refreshOnArtworkSave } from "app/utils/refreshHelpers"
import { useMutation } from "react-relay"
import { graphql } from "relay-runtime"

interface LegacySaveArtworkOptions {
  id: string
  internalID: string
  isSaved: boolean | null
  onCompleted?: (isSaved: boolean) => void
  onError?: (error: Error) => void
}

export const useLegacySaveArtwork = ({
  id,
  internalID,
  isSaved,
  onCompleted,
  onError,
}: LegacySaveArtworkOptions) => {
  const [commit] = useMutation(SaveArtworkMutation)
  const nextSavedState = !isSaved

  return () => {
    commit({
      variables: {
        input: {
          artworkID: internalID,
          remove: isSaved,
        },
      },
      optimisticResponse: {
        saveArtwork: {
          artwork: {
            id,
            isSaved: nextSavedState,
          },
        },
      },
      onCompleted: () => {
        refreshOnArtworkSave()
        onCompleted?.(nextSavedState)
      },
      onError,
    })
  }
}

const SaveArtworkMutation = graphql`
  mutation useLegacySaveArtworkMutation($input: SaveArtworkInput!) {
    saveArtwork(input: $input) {
      artwork {
        id
        isSaved
      }
    }
  }
`
