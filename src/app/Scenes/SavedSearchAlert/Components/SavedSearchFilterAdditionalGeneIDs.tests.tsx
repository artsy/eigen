import { OwnerType } from "@artsy/cohesion"
import { fireEvent, waitFor } from "@testing-library/react-native"
import { SavedSearchFilterAdditionalGeneIDs } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterAdditionalGeneIDs"
import {
  SavedSearchModel,
  SavedSearchStoreProvider,
  savedSearchModel,
} from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { artworkMediumCategories } from "app/utils/artworkMediumCategories"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const black100Hex = "#000000"

describe("SavedSearchFilterAdditionalGeneIDs", () => {
  it("shows all available rarity options unselected", () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchFilterAdditionalGeneIDs />
      </SavedSearchStoreProvider>
    )

    artworkMediumCategories.forEach((option) => {
      expect(getByText(option.label)).toBeDefined()
      expect(getByText(option.label)).toHaveStyle({
        color: black100Hex,
      })
    })
  })

  it("shows the right selected state with the right colors", () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider
        runtimeModel={{ ...initialData, attributes: { additionalGeneIDs: ["Painting"] } }}
      >
        <SavedSearchFilterAdditionalGeneIDs />
      </SavedSearchStoreProvider>
    )

    artworkMediumCategories.forEach((option) => {
      if (option.value === "Painting") {
        expect(getByText("Painting")).not.toHaveStyle({ color: black100Hex })
      } else {
        expect(getByText(option.label)).toBeDefined()
        expect(getByText(option.label)).toHaveStyle({
          color: black100Hex,
        })
      }
    })
  })

  it("Updates selected filters on press", () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchFilterAdditionalGeneIDs />
      </SavedSearchStoreProvider>
    )

    expect(getByText("Painting")).toHaveStyle({ color: black100Hex })

    fireEvent(getByText("Painting"), "onPress")

    waitFor(() => {
      expect(getByText("Painting")).not.toHaveStyle({ color: black100Hex })
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
