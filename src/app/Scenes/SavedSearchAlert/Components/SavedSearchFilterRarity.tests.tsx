import { OwnerType } from "@artsy/cohesion"
import { fireEvent, waitFor } from "@testing-library/react-native"
import { SavedSearchFilterRarity } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterRarity"
import {
  SavedSearchModel,
  SavedSearchStoreProvider,
  savedSearchModel,
} from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const black100Hex = "#000000"

describe("SavedSearchFilterRarity", () => {
  it("shows all available rarity options unselected", () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchFilterRarity />
      </SavedSearchStoreProvider>
    )

    expect(getByText("Unique")).toHaveStyle({ color: black100Hex })
    expect(getByText("Limited Edition")).toHaveStyle({ color: black100Hex })
  })

  it("shows the right selected state with the right colors", () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider
        runtimeModel={{ ...initialData, attributes: { attributionClass: ["unique"] } }}
      >
        <SavedSearchFilterRarity />
      </SavedSearchStoreProvider>
    )

    expect(getByText("Unique")).not.toHaveStyle({ color: black100Hex })
    expect(getByText("Limited Edition")).toHaveStyle({ color: black100Hex })
  })

  it("Updates selected filters on press", () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchFilterRarity />
      </SavedSearchStoreProvider>
    )

    expect(getByText("Unique")).toHaveStyle({ color: black100Hex })

    fireEvent(getByText("Unique"), "onPress")

    waitFor(() => {
      expect(getByText("Unique")).not.toHaveStyle({ color: black100Hex })
    })
  })
})

const initialData: SavedSearchModel = {
  ...savedSearchModel,
  attributes: {
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
