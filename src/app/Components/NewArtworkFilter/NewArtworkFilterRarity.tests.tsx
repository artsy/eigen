import { fireEvent, waitFor } from "@testing-library/react-native"
import {
  ATTRIBUTION_CLASS_OPTIONS,
  NewArtworkFilterRarity,
} from "app/Components/NewArtworkFilter/NewArtworkFilterRarity"
import {
  NewArtworkFiltersStoreProvider,
  getNewArtworkFilterStoreModel,
} from "app/Components/NewArtworkFilter/NewArtworkFilterStore"
import { NewFilterParamName } from "app/Components/NewArtworkFilter/helpers"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("NewArtworkFilterRarity", () => {
  it("shows all available rarity options unselected", () => {
    const { getByText } = renderWithWrappers(
      <NewArtworkFiltersStoreProvider>
        <NewArtworkFilterRarity />
      </NewArtworkFiltersStoreProvider>
    )

    ATTRIBUTION_CLASS_OPTIONS.forEach((option) => {
      expect(getByText(option.displayLabel)).toBeDefined()
      expect(getByText(option.displayLabel).props.color).toEqual("black100")
    })
  })

  it("shows the right selected state with the right colors", () => {
    const { getByText } = renderWithWrappers(
      <NewArtworkFiltersStoreProvider
        runtimeModel={{
          ...getNewArtworkFilterStoreModel(),
          selectedFilters: [
            {
              paramName: NewFilterParamName.attributionClass,
              paramValue: {
                value: "unique",
                displayLabel: "Unique",
              },
            },
          ],
        }}
      >
        <NewArtworkFilterRarity />
      </NewArtworkFiltersStoreProvider>
    )

    expect(getByText("Unique").props.color).not.toEqual("black100")
    expect(getByText("Limited Edition").props.color).toEqual("black100")
    expect(getByText("Open Edition").props.color).toEqual("black100")
    expect(getByText("Unknown Edition").props.color).toEqual("black100")
  })

  it("Updates selected filters on press", () => {
    const { getByText } = renderWithWrappers(
      <NewArtworkFiltersStoreProvider>
        <NewArtworkFilterRarity />
      </NewArtworkFiltersStoreProvider>
    )

    expect(getByText("Unique").props.color).toEqual("black100")

    fireEvent(getByText("Unique"), "onPress")

    waitFor(() => {
      expect(getByText("Unique").props.color).not.toEqual("black100")
    })
  })
})
