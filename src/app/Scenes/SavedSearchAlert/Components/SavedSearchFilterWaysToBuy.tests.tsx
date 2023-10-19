import { OwnerType } from "@artsy/cohesion"
import { fireEvent, waitFor } from "@testing-library/react-native"
import { FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { WAYS_TO_BUY_OPTIONS } from "app/Components/ArtworkFilter/Filters/WaysToBuyOptions"
import { SavedSearchFilterWaysToBuy } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterWaysToBuy"
import {
  SavedSearchModel,
  SavedSearchStoreProvider,
  savedSearchModel,
} from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const black100Hex = "#000000"
const options = WAYS_TO_BUY_OPTIONS.filter(
  (option) => option.paramName !== FilterParamName.waysToBuyContactGallery
)

describe("SavedSearchFilterWaysToBuy", () => {
  it("shows all available ways to buy options unselected", () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchFilterWaysToBuy />
      </SavedSearchStoreProvider>
    )

    options.forEach((option) => {
      expect(getByText(option.displayText)).toBeDefined()
      expect(getByText(option.displayText)).toHaveStyle({
        color: black100Hex,
      })
    })
  })

  it("shows the right selected state", () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={{ ...initialData, attributes: { atAuction: true } }}>
        <SavedSearchFilterWaysToBuy />
      </SavedSearchStoreProvider>
    )

    options.forEach((option) => {
      if (option.paramName === "atAuction") {
        expect(getByText(option.displayText)).not.toHaveStyle({
          color: black100Hex,
        })
      } else {
        expect(getByText(option.displayText)).toHaveStyle({
          color: black100Hex,
        })
      }
    })
  })

  it("Updates selected filters on press", () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchFilterWaysToBuy />
      </SavedSearchStoreProvider>
    )

    expect(getByText("Bid")).toHaveStyle({ color: black100Hex })

    fireEvent(getByText("Bid"), "onPress")

    waitFor(() => {
      expect(getByText("Bid")).not.toHaveStyle({ color: black100Hex })
    })
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
