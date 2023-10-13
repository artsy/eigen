import { OwnerType } from "@artsy/cohesion"
import { fireEvent, waitFor } from "@testing-library/react-native"
import { SavedSearchFilterPriceRangeQR } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterPriceRange"
import {
  SavedSearchModel,
  SavedSearchStoreProvider,
  savedSearchModel,
} from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("SavedSearchFilterPriceRange", () => {
  it("shows the right price range when available", () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: () => (
        <SavedSearchStoreProvider runtimeModel={initialData}>
          <SavedSearchFilterPriceRangeQR />
        </SavedSearchStoreProvider>
      ),
    })

    const { getByText } = renderWithRelay({
      Artist: () => ({
        internalID: "artistID",
        name: "Banksy",
      }),
    })

    waitFor(() => {
      expect(getByText("200")).toBeDefined()
      expect(getByText("3000")).toBeDefined()
    })
  })

  it("Updates the price range appropriately", async () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: () => (
        <SavedSearchStoreProvider runtimeModel={initialData}>
          <SavedSearchFilterPriceRangeQR />
        </SavedSearchStoreProvider>
      ),
    })

    const { getByTestId, getByText } = renderWithRelay({
      Artist: () => ({
        internalID: "artistID",
        name: "Banksy",
      }),
    })

    waitFor(() => {
      expect(getByText("200")).toBeDefined()
      expect(getByText("3000")).toBeDefined()

      fireEvent.changeText(getByTestId("price-min-input"), "300")
      fireEvent.changeText(getByTestId("price-max-input"), "5000")

      expect(getByText("300")).toBeDefined()
      expect(getByText("5000")).toBeDefined()
    })
  })
})

const initialData: SavedSearchModel = {
  ...savedSearchModel,
  attributes: {
    atAuction: true,
    priceRange: "200-3000",
  },
  entity: {
    artists: [{ id: "artistID", name: "Banksy" }],
    owner: {
      type: OwnerType.artist,
      id: "ownerId",
      slug: "ownerSlug",
    },
  },
}
