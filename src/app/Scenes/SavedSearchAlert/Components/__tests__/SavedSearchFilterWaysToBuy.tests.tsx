import { OwnerType } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
import { WAYS_TO_BUY_OPTIONS } from "app/Components/ArtworkFilter/Filters/WaysToBuyOptions"
import { SavedSearchFilterWaysToBuy } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterWaysToBuy"
import {
  SavedSearchModel,
  SavedSearchStoreProvider,
  savedSearchModel,
} from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const mono100Hex = "#000000"

describe("SavedSearchFilterWaysToBuy", () => {
  it("shows all available ways to buy options unselected", async () => {
    await renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchFilterWaysToBuy />
      </SavedSearchStoreProvider>
    )

    WAYS_TO_BUY_OPTIONS.forEach((option) => {
      expect(screen.getByText(option.displayText)).toBeDefined()
      expect(screen.getByText(option.displayText)).toHaveStyle({
        color: mono100Hex,
      })
    })
  })

  it("shows the right selected state", async () => {
    await renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={{ ...initialData, attributes: { atAuction: true } }}>
        <SavedSearchFilterWaysToBuy />
      </SavedSearchStoreProvider>
    )

    WAYS_TO_BUY_OPTIONS.forEach((option) => {
      if (option.paramName === "atAuction") {
        expect(screen.getByText(option.displayText)).not.toHaveStyle({
          color: mono100Hex,
        })
      } else {
        expect(screen.getByText(option.displayText)).toHaveStyle({
          color: mono100Hex,
        })
      }
    })
  })

  it("Updates selected filters on press", async () => {
    await renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchFilterWaysToBuy />
      </SavedSearchStoreProvider>
    )

    expect(screen.getByText("Bid")).toHaveStyle({ color: mono100Hex })

    await fireEvent(screen.getByText("Bid"), "onPress")

    expect(screen.getByText("Bid")).not.toHaveStyle({ color: mono100Hex })
  })
})

const initialData: SavedSearchModel = {
  ...savedSearchModel,
  attributes: {},
  entity: {
    artists: [{ id: "artistID", name: "Banksy" }],
    owner: {
      type: OwnerType.artist,
      id: "ownerId",
      slug: "ownerSlug",
    },
  },
}
