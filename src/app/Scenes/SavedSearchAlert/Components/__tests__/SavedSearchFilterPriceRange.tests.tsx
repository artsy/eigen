import { OwnerType } from "@artsy/cohesion"
import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { SavedSearchFilterPriceRangeQR } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterPriceRange"
import {
  SavedSearchModel,
  SavedSearchStoreProvider,
  savedSearchModel,
} from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("SavedSearchFilterPriceRange", () => {
  it("shows the right price range when available", async () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: () => (
        <SavedSearchStoreProvider runtimeModel={initialData}>
          <SavedSearchFilterPriceRangeQR />
        </SavedSearchStoreProvider>
      ),
    })

    await renderWithRelay({
      Artist: () => ({
        internalID: "artistID",
        name: "Banksy",
      }),
    })

    await waitFor(() => expect(screen.queryByTestId("loading-skeleton")).not.toBeOnTheScreen())

    expect(screen.getByLabelText("Minimum Price Range Input")).toHaveProp("value", "200")
    expect(screen.getByLabelText("Maximum Price Range Input")).toHaveProp("value", "3000")
  })

  it("Updates the price range appropriately", async () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: () => (
        <SavedSearchStoreProvider runtimeModel={initialData}>
          <SavedSearchFilterPriceRangeQR />
        </SavedSearchStoreProvider>
      ),
    })

    await renderWithRelay({
      Artist: () => ({
        internalID: "artistID",
        name: "Banksy",
      }),
    })

    await waitFor(() => expect(screen.queryByTestId("loading-skeleton")).not.toBeOnTheScreen())

    expect(screen.getByLabelText("Minimum Price Range Input")).toHaveProp("value", "200")
    expect(screen.getByLabelText("Maximum Price Range Input")).toHaveProp("value", "3000")

    await fireEvent.changeText(screen.getByTestId("price-min-input"), "300")
    await fireEvent.changeText(screen.getByTestId("price-max-input"), "5000")

    expect(screen.getByLabelText("Minimum Price Range Input")).toHaveProp("value", "300")
    expect(screen.getByLabelText("Maximum Price Range Input")).toHaveProp("value", "5000")
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
