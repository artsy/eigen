import { OwnerType } from "@artsy/cohesion"
import { fireEvent } from "@testing-library/react-native"
import {
  COLORS_INDEXED_BY_VALUE,
  COLOR_OPTIONS,
} from "app/Components/ArtworkFilter/Filters/ColorsOptions"
import { SavedSearchFilterColor } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterColor"
import {
  SavedSearchModel,
  SavedSearchStoreProvider,
  savedSearchModel,
} from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("SavedSearchFilterColor", () => {
  it("shows all available color options unselected", () => {
    const { getByTestId } = renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchFilterColor />
      </SavedSearchStoreProvider>
    )

    COLOR_OPTIONS.forEach((option) => {
      expect(() =>
        getByTestId(`check-icon-${COLORS_INDEXED_BY_VALUE[option.paramValue as string].name}`)
      ).toThrow()
    })
  })

  it("shows the right selected state", () => {
    const { getByTestId } = renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={{ ...initialData, attributes: { colors: ["red"] } }}>
        <SavedSearchFilterColor />
      </SavedSearchStoreProvider>
    )

    COLOR_OPTIONS.forEach((option) => {
      if (option.paramValue !== "red") {
        expect(() =>
          getByTestId(`check-icon-${COLORS_INDEXED_BY_VALUE[option.paramValue as string].name}`)
        ).toThrow()
      } else {
        expect(
          getByTestId(`check-icon-${COLORS_INDEXED_BY_VALUE[option.paramValue as string].name}`)
        ).toBeDefined()
      }
    })
  })

  it("Updates selected filters on press", () => {
    const { getByTestId, getByText } = renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchFilterColor />
      </SavedSearchStoreProvider>
    )

    fireEvent(getByText("Red"), "onPress")

    expect(getByTestId("check-icon-Red")).toBeDefined()
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
