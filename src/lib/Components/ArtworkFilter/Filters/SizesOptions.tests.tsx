import { fireEvent } from "@testing-library/react-native"
import { ArtworkFiltersState, ArtworkFiltersStoreProvider } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { getEssentialProps } from "./helper"
import { SizesOptionsScreen } from "./SizesOptions"

describe("Sizes options screen", () => {
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
  }

  const MockSizesScreen = ({ initialData = initialState }: { initialData?: ArtworkFiltersState }) => {
    return (
      <ArtworkFiltersStoreProvider initialData={initialData}>
        <SizesOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  it("selects only the option that is selected", async () => {
    const { getByText, getAllByA11yState } = renderWithWrappersTL(
      <MockSizesScreen {...getEssentialProps()} initialData={initialState} />
    )
    fireEvent.press(getByText("Small (under 40cm)"))

    const selectedOptions = getAllByA11yState({ checked: true })
    expect(selectedOptions).toHaveLength(1)
    expect(selectedOptions[0]).toHaveTextContent("Small (under 40cm)")
    expect(getByText("Clear")).toBeTruthy()
  })

  it("allows multiple sizes to be selected", () => {
    const { getByText, getAllByA11yState } = renderWithWrappersTL(
      <MockSizesScreen {...getEssentialProps()} initialData={initialState} />
    )
    fireEvent.press(getByText("Small (under 40cm)"))
    fireEvent.press(getByText("Large (over 100cm)"))

    const selectedOptions = getAllByA11yState({ checked: true })
    expect(selectedOptions).toHaveLength(2)
    expect(selectedOptions[0]).toHaveTextContent("Small (under 40cm)")
    expect(selectedOptions[1]).toHaveTextContent("Large (over 100cm)")
  })
})
