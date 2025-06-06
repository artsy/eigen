import { OwnerType } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
import { SavedSearchFilterAdditionalGeneIDs } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterAdditionalGeneIDs"
import {
  SavedSearchModel,
  SavedSearchStoreProvider,
  savedSearchModel,
} from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { gravityArtworkMediumCategories } from "app/utils/artworkMediumCategories"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const mono100Hex = "#000000"

describe("SavedSearchFilterAdditionalGeneIDs", () => {
  it("shows all available categories unselected", () => {
    renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchFilterAdditionalGeneIDs />
      </SavedSearchStoreProvider>
    )

    gravityArtworkMediumCategories.slice(0, 7).forEach((option) => {
      expect(screen.getByText(option.label)).toBeOnTheScreen()
      expect(screen.getByText(option.label)).toHaveStyle({
        color: mono100Hex,
      })
    })
  })

  it("shows the right selected categories", () => {
    renderWithWrappers(
      <SavedSearchStoreProvider
        runtimeModel={{ ...initialData, attributes: { additionalGeneIDs: ["painting"] } }}
      >
        <SavedSearchFilterAdditionalGeneIDs />
      </SavedSearchStoreProvider>
    )

    gravityArtworkMediumCategories.slice(0, 7).forEach((option) => {
      if (option.value === "painting") {
        expect(screen.getByText("Painting")).not.toHaveStyle({ color: mono100Hex })
      } else {
        expect(screen.getByText(option.label)).toBeOnTheScreen()
        expect(screen.getByText(option.label)).toHaveStyle({
          color: mono100Hex,
        })
      }
    })
  })

  it("Updates selected categories filters on press", () => {
    renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchFilterAdditionalGeneIDs />
      </SavedSearchStoreProvider>
    )

    expect(screen.getByText("Work on Paper")).toHaveStyle({ color: mono100Hex })

    fireEvent(screen.getByText("Work on Paper"), "onPress")

    expect(screen.getByText("Work on Paper")).not.toHaveStyle({ color: mono100Hex })
  })

  it("Shows all categories if the user has already selected mediums", () => {
    renderWithWrappers(
      <SavedSearchStoreProvider
        runtimeModel={{
          ...initialData,
          attributes: {
            additionalGeneIDs: ["textile-arts"],
          },
        }}
      >
        <SavedSearchFilterAdditionalGeneIDs />
      </SavedSearchStoreProvider>
    )

    gravityArtworkMediumCategories.forEach((option) => {
      expect(screen.getByText(option.label)).toBeDefined()
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
