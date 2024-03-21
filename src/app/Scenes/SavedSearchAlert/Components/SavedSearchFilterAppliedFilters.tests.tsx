import { OwnerType } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
import { SavedSearchFilterAppliedFilters } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterAppliedFilters"
import {
  SavedSearchModel,
  SavedSearchStoreProvider,
  savedSearchModel,
} from "app/Scenes/SavedSearchAlert/SavedSearchStore"

import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/Scenes/SavedSearchAlert/useSavedSearchPills", () => {
  return {
    useSavedSearchPills: () => [
      { label: "Open Edition", paramName: "attributionClass", value: "open edition" },
      { label: "Banksy", paramName: "artistIDs", value: "banksy" },
    ],
  }
})

describe("SavedSearchFilterAppliedFilters", () => {
  it("shows all selected filters", () => {
    renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchFilterAppliedFilters />
      </SavedSearchStoreProvider>
    )

    expect(screen.getByText("Open Edition")).toBeDefined()
    expect(screen.getByText("Banksy")).toBeDefined()
  })

  // TODO: fix this test
  it.skip("removes filter when tapped", () => {
    renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchFilterAppliedFilters />
      </SavedSearchStoreProvider>
    )

    expect(screen.getByText("Open Edition")).toBeDefined()

    fireEvent.press(screen.getByText("Open Edition"), "onPress")

    expect(() => screen.getByText("Open Edition")).toThrow()
  })

  it("can't remove artist pill", () => {
    renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchFilterAppliedFilters />
      </SavedSearchStoreProvider>
    )

    expect(screen.getByText("Banksy")).toBeDefined()

    fireEvent.press(screen.getByText("Banksy"), "onPress")

    expect(screen.getByText("Banksy")).toBeDefined()
  })
})

const initialData: SavedSearchModel = {
  ...savedSearchModel,
  attributes: {
    attributionClass: ["open edition"],
    atAuction: true,
    artistIDs: ["banksy"],
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
