import { OwnerType } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
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
  it("shows all available color options unselected", async () => {
    await renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchFilterColor />
      </SavedSearchStoreProvider>
    )

    COLOR_OPTIONS.forEach((option) => {
      expect(() =>
        screen.getByTestId(
          `check-icon-${COLORS_INDEXED_BY_VALUE[option.paramValue as string].name}`
        )
      ).toThrow()
    })
  })

  it("shows the right selected state", async () => {
    await renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={{ ...initialData, attributes: { colors: ["red"] } }}>
        <SavedSearchFilterColor />
      </SavedSearchStoreProvider>
    )

    COLOR_OPTIONS.forEach((option) => {
      if (option.paramValue !== "red") {
        expect(() =>
          screen.getByTestId(
            `check-icon-${COLORS_INDEXED_BY_VALUE[option.paramValue as string].name}`
          )
        ).toThrow()
      } else {
        expect(
          screen.getByTestId(
            `check-icon-${COLORS_INDEXED_BY_VALUE[option.paramValue as string].name}`
          )
        ).toBeDefined()
      }
    })
  })

  it("Updates selected filters on press", async () => {
    await renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <SavedSearchFilterColor />
      </SavedSearchStoreProvider>
    )

    await fireEvent(screen.getByText("Red"), "onPress")

    expect(screen.getByTestId("check-icon-Red")).toBeDefined()
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
