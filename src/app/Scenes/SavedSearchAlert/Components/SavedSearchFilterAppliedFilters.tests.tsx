import { OwnerType } from "@artsy/cohesion"
import { fireEvent } from "@testing-library/react-native"
import { SavedSearchFilterAppliedFilters } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterAppliedFilters"

import {
  SavedSearchModel,
  SavedSearchStoreProvider,
  savedSearchModel,
} from "app/Scenes/SavedSearchAlert/SavedSearchStore"

import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("SavedSearchFilterAppliedFilters", () => {
  it("shows all selected filters", () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchFilterAppliedFilters />
      </SavedSearchStoreProvider>
    )

    expect(getByText("Open Edition")).toBeDefined()
    expect(getByText("Banksy")).toBeDefined()
  })

  it("removes filter when tapped", () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchFilterAppliedFilters />
      </SavedSearchStoreProvider>
    )

    expect(getByText("Open Edition")).toBeDefined()

    fireEvent.press(getByText("Open Edition"), "onPress")

    expect(() => getByText("Open Edition")).toThrow()
  })

  it("can't remove artist pill", () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchFilterAppliedFilters />
      </SavedSearchStoreProvider>
    )

    expect(getByText("Banksy")).toBeDefined()

    fireEvent.press(getByText("Banksy"), "onPress")

    expect(getByText("Banksy")).toBeDefined()
  })
})

const initialData: SavedSearchModel = {
  ...savedSearchModel,
  attributes: {
    attributionClass: ["open edition"],
    atAuction: true,
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
