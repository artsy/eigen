import { fireEvent, screen } from "@testing-library/react-native"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { CategoriesOptionsScreen } from "app/Components/ArtworkFilter/Filters/CategoriesOptions"
import { getEssentialProps } from "app/Components/ArtworkFilter/Filters/helper"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("Categories options screen", () => {
  const MockCategoryScreen = ({
    initialData = initialState,
  }: {
    initialData?: ArtworkFiltersState
  }) => {
    return (
      <ArtworkFiltersStoreProvider
        runtimeModel={{
          ...getArtworkFiltersModel(),
          ...initialData,
        }}
      >
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
    showFilterArtworksModal: false,
    sizeMetric: "cm",
  }

  it("selects only the option that is selected", () => {
    renderWithWrappers(<MockCategoryScreen {...getEssentialProps()} initialData={initialState} />)

    fireEvent.press(screen.getByText("Painting"))

    const options = screen.getAllByTestId("multi-select-option-button")
    const checkboxes = screen.getAllByTestId("multi-select-option-checkbox")

    expect(options).toHaveLength(6)
    expect(checkboxes).toHaveLength(6)

    expect(options[0]).toHaveTextContent("Painting")

    expect(checkboxes[0]).toHaveProp("selected", true)

    expect(checkboxes[1]).toHaveProp("selected", false)

    expect(screen.getByText("Clear")).toBeTruthy()
  })

  it("allows multiple categories to be selected", () => {
    renderWithWrappers(<MockCategoryScreen {...getEssentialProps()} initialData={initialState} />)
    fireEvent.press(screen.getByText("Painting"))
    fireEvent.press(screen.getByText("Work on Paper"))

    const options = screen.getAllByTestId("multi-select-option-button")

    expect(options[0]).toHaveTextContent("Painting")
    expect(options[1]).toHaveTextContent("Work on Paper")

    const checkboxes = screen.getAllByTestId("multi-select-option-checkbox")

    expect(options).toHaveLength(6)
    expect(checkboxes).toHaveLength(6)

    expect(checkboxes[0]).toHaveProp("selected", true)
    expect(checkboxes[1]).toHaveProp("selected", true)
    expect(checkboxes[2]).toHaveProp("selected", false)
    expect(checkboxes[3]).toHaveProp("selected", false)
    expect(checkboxes[4]).toHaveProp("selected", false)
    expect(checkboxes[5]).toHaveProp("selected", false)
  })
})
