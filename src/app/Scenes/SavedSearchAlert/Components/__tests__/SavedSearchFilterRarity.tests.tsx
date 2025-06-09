import { OwnerType } from "@artsy/cohesion"
import { fireEvent } from "@testing-library/react-native"
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
  it("shows all available rarity options unselected", () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchFilterRarity />
      </SavedSearchStoreProvider>
    )

    KNOWN_ATTRIBUTION_CLASS_OPTIONS.forEach((option) => {
      expect(getByText(option.displayText)).toBeDefined()
      expect(getByText(option.displayText)).toHaveStyle({
        color: mono100Hex,
      })
    })
  })

  it("shows the right selected state with the right colors", () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider
        runtimeModel={{ ...initialData, attributes: { attributionClass: ["unique"] } }}
      >
        <SavedSearchFilterRarity />
      </SavedSearchStoreProvider>
    )

    expect(getByText("Unique")).not.toHaveStyle({ color: mono100Hex })
    expect(getByText("Limited Edition")).toHaveStyle({ color: mono100Hex })
    expect(getByText("Open Edition")).toHaveStyle({ color: mono100Hex })
  })

  it("Updates selected filters on press", async () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchFilterRarity />
      </SavedSearchStoreProvider>
    )

    fireEvent(getByText("Unique"), "onPress")

    expect(getByText("Unique")).not.toHaveStyle({ color: mono100Hex })
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
