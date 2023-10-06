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

const black100Hex = "#000000"

describe("NewArtworkFilterRarity", () => {
  it("shows all available rarity options unselected", () => {
    const { getByText } = renderWithWrappers(
      <NewArtworkFiltersStoreProvider>
        <NewArtworkFilterRarity />
      </NewArtworkFiltersStoreProvider>
    )

    ATTRIBUTION_CLASS_OPTIONS.forEach((option) => {
      expect(getByText(option.displayLabel)).toBeDefined()
      expect(getByText(option.displayLabel)).toHaveStyle({
        color: black100Hex,
      })
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

    expect(getByText("Unique")).not.toHaveStyle({ color: black100Hex })
    expect(getByText("Limited Edition")).toHaveStyle({ color: black100Hex })
    expect(getByText("Open Edition")).toHaveStyle({ color: black100Hex })
    expect(getByText("Unknown Edition")).toHaveStyle({ color: black100Hex })
  })

  it("Updates selected filters on press", () => {
    const { getByText } = renderWithWrappers(
      <NewArtworkFiltersStoreProvider>
        <NewArtworkFilterRarity />
      </NewArtworkFiltersStoreProvider>
    )

    expect(getByText("Unique")).toHaveStyle({ color: black100Hex })

    fireEvent(getByText("Unique"), "onPress")

    waitFor(() => {
      expect(getByText("Unique")).not.toHaveStyle({ color: black100Hex })
    })
  })
})
