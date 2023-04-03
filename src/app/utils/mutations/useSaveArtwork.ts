import { refreshOnArtworkSave } from "app/utils/refreshHelpers"
import { Schema } from "app/utils/track"
import { useMutation } from "react-relay"
import { graphql } from "relay-runtime"

export const useSaveArtwork = ({
  id,
  internalID,
  isSaved,
  onCompleted,
  onError,
  contextScreen,
}: {
  id: string
  internalID: string
  isSaved: boolean | null
  onCompleted?: () => void
  onError?: () => void
  contextScreen?: Schema.OwnerEntityTypes
}) => {
  const [commit] = useMutation(SaveArtworkMutation)

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
            isSaved: !isSaved,
          },
        },
      },
      onCompleted: () => {
        refreshOnArtworkSave(contextScreen)
        onCompleted?.()
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
