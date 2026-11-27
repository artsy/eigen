import { removeArtworkFromArtworkListConnections } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/useUpdateArtworkListsForArtwork"
import { ConnectionHandler, commitLocalUpdate, RecordSourceSelectorProxy } from "relay-runtime"
import { createMockEnvironment } from "relay-test-utils"

const setupStore = (store: RecordSourceSelectorProxy) => {
  const root = store.getRoot()
  const me = store.create("me-id", "Me")
  root.setLinkedRecord(me, "me")

  const collection = store.create("saved-artwork-id", "Collection")
  collection.setValue("saved-artwork", "internalID")
  me.setLinkedRecord(collection, "collection", { id: "saved-artwork" })

  const connection = store.create("connection-id", "ArtworkConnection")
  connection.setValue(2, "totalCount")
  collection.setLinkedRecord(connection, "__ArtworkList_artworks_connection", {
    sort: "SAVED_AT_DESC",
  })

  const edges = ["artwork-1", "artwork-2"].map((id) => {
    const artwork = store.create(id, "Artwork")
    return ConnectionHandler.createEdge(store, connection, artwork, "ArtworkEdge")
  })
  connection.setLinkedRecords(edges, "edges")
}

const getConnection = (store: RecordSourceSelectorProxy) => {
  const collection = store
    .getRoot()
    .getLinkedRecord("me")
    ?.getLinkedRecord("collection", { id: "saved-artwork" })

  return ConnectionHandler.getConnection(collection!, "ArtworkList_artworks", {
    sort: "SAVED_AT_DESC",
  })!
}

const getNodeIDs = (store: RecordSourceSelectorProxy) =>
  getConnection(store)
    .getLinkedRecords("edges")
    ?.map((edge) => edge?.getLinkedRecord("node")?.getDataID())

describe("removeArtworkFromArtworkListConnections", () => {
  it("removes the artwork from the lists it was removed from and updates the count", () => {
    const environment = createMockEnvironment()

    commitLocalUpdate(environment, (store) => {
      setupStore(store)

      removeArtworkFromArtworkListConnections(store, "artwork-1", [{ internalID: "saved-artwork" }])

      expect(getNodeIDs(store)).toEqual(["artwork-2"])
      expect(getConnection(store).getValue("totalCount")).toBe(1)
    })
  })

  it("doesn't touch lists the artwork wasn't removed from", () => {
    const environment = createMockEnvironment()

    commitLocalUpdate(environment, (store) => {
      setupStore(store)

      removeArtworkFromArtworkListConnections(store, "artwork-1", [{ internalID: "other-list" }])

      expect(getNodeIDs(store)).toEqual(["artwork-1", "artwork-2"])
      expect(getConnection(store).getValue("totalCount")).toBe(2)
    })
  })
})
