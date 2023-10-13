import { OwnerType } from "@artsy/cohesion"
import { fireEvent, screen, waitForElementToBeRemoved } from "@testing-library/react-native"
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

    const { getByTestId } = renderWithRelay({
      Artist: () => ({
        internalID: "artistID",
        name: "Banksy",
      }),
    })

    await waitForElementToBeRemoved(() => getByTestId("loading-skeleton"))

    expect(screen.getByText("200")).toBeOnTheScreen()
    expect(screen.getByText("3000")).toBeOnTheScreen()
  })

  it("Updates the price range appropriately", async () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: () => (
        <SavedSearchStoreProvider runtimeModel={initialData}>
          <SavedSearchFilterPriceRangeQR />
        </SavedSearchStoreProvider>
      ),
    })

    const { getByTestId } = renderWithRelay({
      Artist: () => ({
        internalID: "artistID",
        name: "Banksy",
      }),
    })

    await waitForElementToBeRemoved(() => getByTestId("loading-skeleton"))

    expect(screen.getByText("200")).toBeOnTheScreen()
    expect(screen.getByText("3000")).toBeOnTheScreen()

    fireEvent.changeText(getByTestId("price-min-input"), "300")
    fireEvent.changeText(getByTestId("price-max-input"), "5000")

    expect(screen.getByText("300")).toBeOnTheScreen()
    expect(screen.getByText("5000")).toBeOnTheScreen()
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
