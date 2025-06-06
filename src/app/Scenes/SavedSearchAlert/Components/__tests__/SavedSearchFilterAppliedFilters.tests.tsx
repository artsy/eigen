import { OwnerType } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
import { SavedSearchFilterAppliedFilters } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterAppliedFilters"
import {
  SavedSearchModel,
  SavedSearchStoreProvider,
  savedSearchModel,
} from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { useSavedSearchPills } from "app/Scenes/SavedSearchAlert/useSavedSearchPills"

import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/Scenes/SavedSearchAlert/useSavedSearchPills")

describe("SavedSearchFilterAppliedFilters", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("shows all selected filters", () => {
    ;(useSavedSearchPills as jest.Mock).mockImplementationOnce(() => [banksyPill, openEditionPill])

    renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchFilterAppliedFilters />
      </SavedSearchStoreProvider>
    )

    expect(screen.getByText("Open Edition")).toBeDefined()
    expect(screen.getByText("Banksy")).toBeDefined()
  })

  it("removes filter when tapped", () => {
    ;(useSavedSearchPills as jest.Mock)
      .mockImplementationOnce(() => [banksyPill, openEditionPill])
      .mockImplementationOnce(() => [banksyPill])

    const { rerender } = renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchFilterAppliedFilters />
      </SavedSearchStoreProvider>
    )

    expect(screen.getByText("Open Edition")).toBeDefined()

    fireEvent.press(screen.getByText("Open Edition"))

    rerender(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchFilterAppliedFilters />
      </SavedSearchStoreProvider>
    )

    expect(screen.queryByText("Open Edition")).not.toBeOnTheScreen()
  })

  it("can't remove artist pill", () => {
    ;(useSavedSearchPills as jest.Mock).mockImplementationOnce(() => [banksyPill, openEditionPill])

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

const openEditionPill = {
  label: "Open Edition",
  paramName: "attributionClass",
  value: "open edition",
}
const banksyPill = {
  label: "Banksy",
  paramName: "artistIDs",
  value: "banksy",
}
