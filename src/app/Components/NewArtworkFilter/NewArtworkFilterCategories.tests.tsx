import { fireEvent, waitFor } from "@testing-library/react-native"
import {
  CATEGORIES_OPTIONS,
  NewArtworkFilterCategories,
} from "app/Components/NewArtworkFilter/NewArtworkFilterCategories"
import {
  NewArtworkFiltersStoreProvider,
  getNewArtworkFilterStoreModel,
} from "app/Components/NewArtworkFilter/NewArtworkFilterStore"
import { NewFilterParamName } from "app/Components/NewArtworkFilter/helpers"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const black100Hex = "#000000"

describe("NewArtworkFilterCategories", () => {
  it("shows all available category options unselected", () => {
    const { getByText } = renderWithWrappers(
      <NewArtworkFiltersStoreProvider>
        <NewArtworkFilterCategories />
      </NewArtworkFiltersStoreProvider>
    )

    CATEGORIES_OPTIONS.forEach((option) => {
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
              paramName: NewFilterParamName.categories,
              paramValue: {
                value: "Work on Paper",
                displayLabel: "Work on Paper",
              },
            },
          ],
        }}
      >
        <NewArtworkFilterCategories />
      </NewArtworkFiltersStoreProvider>
    )

    expect(getByText("Print")).toHaveStyle({ color: black100Hex })
    expect(getByText("Photography")).toHaveStyle({ color: black100Hex })
    expect(getByText("Work on Paper")).not.toHaveStyle({ color: black100Hex })
    expect(getByText("Ephemera or Merchandise")).toHaveStyle({ color: black100Hex })
    expect(getByText("Painting")).toHaveStyle({ color: black100Hex })
    expect(getByText("Drawing")).toHaveStyle({ color: black100Hex })
    expect(getByText("Sculpture")).toHaveStyle({ color: black100Hex })
  })

  it("Updates selected filters on press", () => {
    const { getByText } = renderWithWrappers(
      <NewArtworkFiltersStoreProvider>
        <NewArtworkFilterCategories />
      </NewArtworkFiltersStoreProvider>
    )

    expect(getByText("Work on Paper")).toHaveStyle({ color: black100Hex })

    fireEvent(getByText("Work on Paper"), "onPress")

    waitFor(() => {
      expect(getByText("Work on Paper")).not.toHaveStyle({ color: black100Hex })
    })
  })
})
