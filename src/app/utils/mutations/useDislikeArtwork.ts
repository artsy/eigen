import { useDislikeArtworkMutation } from "__generated__/useDislikeArtworkMutation.graphql"
import { useMutation } from "app/utils/useMutation"
import { ConnectionHandler, graphql } from "react-relay"
import { RecordSourceSelectorProxy } from "relay-runtime"

export const useDislikeArtwork = () => {
  return useMutation<useDislikeArtworkMutation>({
    mutation: DislikeArtworkMutation,
    updater: (store, data) => dislikeArtworkUpdater(store, data),
  })
}

const dislikeArtworkUpdater = (store: RecordSourceSelectorProxy<{}>, data: {}) => {
  const artworkID = (data as any).dislikeArtwork?.artwork?.internalID

  if (!artworkID) return

  const root = store.getRoot()
  const viewer = root.getLinkedRecord("viewer")

  if (!viewer) return

  const artworksConnection = ConnectionHandler.getConnection(
    viewer,
    "NewWorksForYou_artworksForUser"
  )

  if (!artworksConnection) return

  ConnectionHandler.deleteNode(artworksConnection, artworkID)
}

const DislikeArtworkMutation = graphql`
  mutation useDislikeArtworkMutation($artworkID: String!) {
    dislikeArtwork(input: { artworkID: $artworkID, remove: false }) {
      artwork {
        internalID
      }
    }
  }
`
