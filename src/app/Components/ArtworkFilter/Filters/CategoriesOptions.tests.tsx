import { fireEvent } from "@testing-library/react-native"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { CategoriesOptionsScreen } from "./CategoriesOptions"
import { getEssentialProps } from "./helper"

describe("Categories options screen", () => {
  const MockCategoryScreen = ({
    initialData = initialState,
  }: {
    initialData?: ArtworkFiltersState
  }) => {
    return (
      <ArtworkFiltersStoreProvider initialData={initialData}>
        <CategoriesOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  const initialState: ArtworkFiltersState = {
    selectedFilters: [],
    appliedFilters: [],
    previouslyAppliedFilters: [],
    applyFilters: false,
    aggregations: [],
    filterType: "auctionResult",
    counts: {
      total: null,
      followedArtists: null,
    },
    sizeMetric: "cm",
  }

  it("selects only the option that is selected", () => {
    const { getByText, getAllByA11yState } = renderWithWrappersTL(
      <MockCategoryScreen {...getEssentialProps()} initialData={initialState} />
    )
    fireEvent.press(getByText("Painting"))

    const selectedOptions = getAllByA11yState({ checked: true })
    expect(selectedOptions).toHaveLength(1)
    expect(selectedOptions[0]).toHaveTextContent("Painting")
    expect(getByText("Clear")).toBeTruthy()
  })

  it("allows multiple categories to be selected", () => {
    const { getByText, getAllByA11yState } = renderWithWrappersTL(
      <MockCategoryScreen {...getEssentialProps()} initialData={initialState} />
    )
    fireEvent.press(getByText("Painting"))
    fireEvent.press(getByText("Work on Paper"))

    const selectedOptions = getAllByA11yState({ checked: true })
    expect(selectedOptions).toHaveLength(2)
    expect(selectedOptions[0]).toHaveTextContent("Painting")
    expect(selectedOptions[1]).toHaveTextContent("Work on Paper")
  })
})
