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
  const artworkID = (data as any).dislikeArtwork?.artwork?.id

  if (!artworkID) return

  const root = store.getRoot()
  const viewer = root.getLinkedRecord("viewer")

  if (!viewer) return

  const newWorksForYouRailConnection = ConnectionHandler.getConnection(
    viewer,
    "NewWorksForYou_artworksForUser"
  )

  if (newWorksForYouRailConnection) {
    ConnectionHandler.deleteNode(newWorksForYouRailConnection, artworkID)
  }

  const newWorksForYouScreenConnection = ConnectionHandler.getConnection(
    viewer,
    "NewWorksForYou_artworks"
  )

  if (newWorksForYouScreenConnection) {
    ConnectionHandler.deleteNode(newWorksForYouScreenConnection, artworkID)
  }
}

const DislikeArtworkMutation = graphql`
  mutation useDislikeArtworkMutation($artworkID: String!) {
    dislikeArtwork(input: { artworkID: $artworkID, remove: false }) {
      artwork {
        id
      }
    }
  }
`
