import { refreshOnArtworkSave } from "app/utils/refreshHelpers"
import { Schema } from "app/utils/track"
import { useMutation } from "react-relay"
import { graphql } from "relay-runtime"

export interface SaveArtworkOptions {
  id: string
  internalID: string
  isSaved: boolean | null
  onCompleted?: (isSaved: boolean) => void
  onError?: () => void
  contextScreen?: Schema.OwnerEntityTypes
}

export const useSaveArtwork = ({
  id,
  internalID,
  isSaved,
  onCompleted,
  onError,
  contextScreen,
}: SaveArtworkOptions) => {
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
        refreshOnArtworkSave(contextScreen)
        onCompleted?.(nextSavedState)
      },
      onError: () => {
        onError?.()
      },
    })
  }
}

const SaveArtworkMutation = graphql`
  mutation useSaveArtworkMutation($input: SaveArtworkInput!) {
    saveArtwork(input: $input) {
      artwork {
        id
        isSaved
      }
    }
  }
`
