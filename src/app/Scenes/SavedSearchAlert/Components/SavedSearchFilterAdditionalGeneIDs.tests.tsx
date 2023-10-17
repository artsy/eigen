import { OwnerType } from "@artsy/cohesion"
import { fireEvent, waitFor } from "@testing-library/react-native"
import { SavedSearchFilterAdditionalGeneIDs } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterAdditionalGeneIDs"
import {
  SavedSearchModel,
  SavedSearchStoreProvider,
  savedSearchModel,
} from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { gravityArtworkMediumCategories } from "app/utils/artworkMediumCategories"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const black100Hex = "#000000"

describe("SavedSearchFilterAdditionalGeneIDs", () => {
  it("shows all available categories unselected", () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchFilterAdditionalGeneIDs />
      </SavedSearchStoreProvider>
    )

    gravityArtworkMediumCategories.slice(0, 7).forEach((option) => {
      expect(getByText(option.label)).toBeDefined()
      expect(getByText(option.label)).toHaveStyle({
        color: black100Hex,
      })
    })
  })

  it("shows the right selected categories", () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider
        runtimeModel={{ ...initialData, attributes: { additionalGeneIDs: ["painting"] } }}
      >
        <SavedSearchFilterAdditionalGeneIDs />
      </SavedSearchStoreProvider>
    )

    gravityArtworkMediumCategories.slice(0, 7).forEach((option) => {
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

  it("Updates selected categories filters on press", () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchFilterAdditionalGeneIDs />
      </SavedSearchStoreProvider>
    )

    expect(getByText("Work on Paper")).toHaveStyle({ color: black100Hex })

    fireEvent(getByText("Work on Paper"), "onPress")

    waitFor(() => {
      expect(getByText("Work on Paper")).not.toHaveStyle({ color: black100Hex })
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
