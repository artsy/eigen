import { OwnerType } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
import { KNOWN_ATTRIBUTION_CLASS_OPTIONS } from "app/Components/ArtworkFilter/Filters/AttributionClassOptions"
import { SavedSearchFilterRarity } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterRarity"
import {
  SavedSearchModel,
  SavedSearchStoreProvider,
  savedSearchModel,
} from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const mono100Hex = "#000000"

describe("SavedSearchFilterRarity", () => {
  it("shows all available rarity options unselected", async () => {
    await renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchFilterRarity />
      </SavedSearchStoreProvider>
    )

    KNOWN_ATTRIBUTION_CLASS_OPTIONS.forEach((option) => {
      expect(screen.getByText(option.displayText)).toBeDefined()
      expect(screen.getByText(option.displayText)).toHaveStyle({
        color: mono100Hex,
      })
    })
  })

  it("shows the right selected state with the right colors", async () => {
    await renderWithWrappers(
      <SavedSearchStoreProvider
        runtimeModel={{ ...initialData, attributes: { attributionClass: ["unique"] } }}
      >
        <SavedSearchFilterRarity />
      </SavedSearchStoreProvider>
    )

    expect(screen.getByText("Unique")).not.toHaveStyle({ color: mono100Hex })
    expect(screen.getByText("Limited Edition")).toHaveStyle({ color: mono100Hex })
    expect(screen.getByText("Open Edition")).toHaveStyle({ color: mono100Hex })
  })

  it("Updates selected filters on press", async () => {
    await renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchFilterRarity />
      </SavedSearchStoreProvider>
    )

    await fireEvent(screen.getByText("Unique"), "onPress")

    expect(screen.getByText("Unique")).not.toHaveStyle({ color: mono100Hex })
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
