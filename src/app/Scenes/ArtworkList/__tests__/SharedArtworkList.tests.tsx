import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { SharedArtworkListScreen } from "app/Scenes/ArtworkList/SharedArtworkList"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

const OWNER_ID = "owner-user-id"
const COLLECTION_ID = "collection-id"

const collection = {
  name: "My Shared List",
  internalID: COLLECTION_ID,
  slug: "my-shared-list",
  private: false,
  default: false,
  shareableWithPartners: false,
}

describe("SharedArtworkList", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => <SharedArtworkListScreen collectionID={COLLECTION_ID} userID={OWNER_ID} />,
  })

  describe("null collection", () => {
    it("shows an unavailable message", async () => {
      renderWithRelay({ Query: () => ({ collection: null }) })

      await waitFor(() => {
        expect(screen.getByText("This list is private or no longer available.")).toBeOnTheScreen()
      })
    })
  })

  describe("owner", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectState({ auth: { userID: OWNER_ID } })
    })

    it("shows the contextual menu button", async () => {
      renderWithRelay({ Collection: () => collection })

      await waitFor(() => {
        expect(screen.getByLabelText("Contextual Menu Button")).toBeOnTheScreen()
      })
    })

    it("hides Edit List and Delete List for the default Saved Artworks list, keeping Share List", async () => {
      renderWithRelay({ Collection: () => ({ ...collection, default: true }) })

      await screen.findByTestId("fancy-modal-header-right-button")
      fireEvent.press(screen.getByTestId("fancy-modal-header-right-button"))

      expect(screen.queryByText("Edit List")).not.toBeOnTheScreen()
      expect(screen.queryByText("Delete List")).not.toBeOnTheScreen()
      expect(screen.getByText("Share List")).toBeOnTheScreen()
    })
  })

  describe("non-owner", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectState({ auth: { userID: "someone-else" } })
    })

    it("hides the contextual menu button", async () => {
      renderWithRelay({ Collection: () => collection })

      await waitFor(() => {
        expect(screen.queryByLabelText("Contextual Menu Button")).not.toBeOnTheScreen()
      })
    })
  })
})
