import { OwnerType } from "@artsy/cohesion"
import { fireEvent, waitFor } from "@testing-library/react-native"
import { CATEGORIES_OPTIONS } from "app/Components/ArtworkFilter/Filters/CategoriesOptions"
import { SavedSearchFilterAdditionalGeneIDs } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterAdditionalGeneIDs"
import {
  SavedSearchModel,
  SavedSearchStoreProvider,
  savedSearchModel,
} from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const black100Hex = "#000000"

describe("SavedSearchFilterAdditionalGeneIDs", () => {
  it("shows all available rarity options unselected", () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchFilterAdditionalGeneIDs />
      </SavedSearchStoreProvider>
    )

    CATEGORIES_OPTIONS.forEach((option) => {
      expect(getByText(option.displayText)).toBeDefined()
      expect(getByText(option.displayText)).toHaveStyle({
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

    CATEGORIES_OPTIONS.forEach((option) => {
      if (option.paramValue === "Painting") {
        expect(getByText("Painting")).not.toHaveStyle({ color: black100Hex })
      } else {
        expect(getByText(option.displayText)).toBeDefined()
        expect(getByText(option.displayText)).toHaveStyle({
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
