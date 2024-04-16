import { useDislikeArtworkMutation } from "__generated__/useDislikeArtworkMutation.graphql"
import { useMutation } from "app/utils/useMutation"
import { ConnectionHandler, graphql } from "react-relay"
import { RecordSourceSelectorProxy } from "relay-runtime"

export const useDislikeArtwork = () => {
  console.log("[Debug] useDislieArtwork")

  return useMutation<useDislikeArtworkMutation>({
    mutation: DislikeArtworkMutation,
    updater: (store, data) => dislikeArtworkUpdater(store, data),
  })
}

const dislikeArtworkUpdater = (store: RecordSourceSelectorProxy<{}>, data: {}) => {
  const artworkID = (data as any).dislikeArtwork?.artwork?.internalID

  if (!artworkID) return

  console.log("[Debug] artworkID", artworkID)

  const root = store.getRoot()
  const viewer = root.getLinkedRecord("viewer")

  const test = root.getLinkedRecord("artworksForUser")
  const test2 = root.getLinkedRecords("artworksForUser")

  console.log("[Debug] test", { test })
  console.log("[Debug] test2", { test2 })

  console.log("[Debug] viewer", { viewer })

  if (!viewer) return

  const artworksConnection = ConnectionHandler.getConnection(
    viewer,
    "NewWorksForYou_artworksForUser"
  )

  console.log("[Debug] artworksConnection", { artworksConnection })

  if (!artworksConnection) return

  console.log("[Debug] deleting node!")

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
