import { screen } from "@testing-library/react-native"
import { FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersStoreProvider,
  ArtworkFiltersState,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { SortOptionsScreen } from "app/Components/ArtworkFilter/Filters/SortOptions"
import { getEssentialProps } from "app/Components/ArtworkFilter/Filters/helper"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("Sort Options Screen", () => {
  const initialState: ArtworkFiltersState = {
    selectedFilters: [],
    appliedFilters: [],
    previouslyAppliedFilters: [],
    applyFilters: false,
    aggregations: [],
    filterType: "artwork",
    counts: {
      total: null,
      followedArtists: null,
    },
    showFilterArtworksModal: false,
    sizeMetric: "cm",
  }

  const MockSortScreen = ({
    initialData = initialState,
  }: {
    initialData?: ArtworkFiltersState
  }) => (
    <ArtworkFiltersStoreProvider
      runtimeModel={{
        ...getArtworkFiltersModel(),
        ...initialData,
      }}
    >
      <SortOptionsScreen {...getEssentialProps()} />
    </ArtworkFiltersStoreProvider>
  )

  const selectedSortOption = () => {
    const selectedOptions = screen
      .getAllByTestId("single-select-option")
      .filter((row) => !!row.props.accessibilityState?.selected)
    expect(selectedOptions).toHaveLength(1)
    return selectedOptions[0]
  }

  it("renders the correct number of sort options", async () => {
    await renderWithWrappers(<MockSortScreen initialData={initialState} />)
    expect(screen.getAllByTestId("single-select-option")).toHaveLength(7)
  })

  describe("selectedSortOption", () => {
    it("returns the default option if there are no selected or applied filters", async () => {
      await renderWithWrappers(<MockSortScreen initialData={initialState} />)
      const selectedOption = selectedSortOption()
      expect(selectedOption).toHaveTextContent("Recommended", { exact: false })
    })

    it("prefers an applied filter over the default filter", async () => {
      const injectedState: ArtworkFiltersState = {
        selectedFilters: [],
        appliedFilters: [
          {
            displayText: "Recently Added",

            paramName: FilterParamName.sort,
            paramValue: "-published_at",
          },
        ],
        previouslyAppliedFilters: [
          {
            displayText: "Recently Added",

            paramName: FilterParamName.sort,
            paramValue: "-published_at",
          },
        ],
        applyFilters: false,
        aggregations: [],
        filterType: "artwork",
        counts: {
          total: null,
          followedArtists: null,
        },
        showFilterArtworksModal: false,
        sizeMetric: "cm",
      }

      await renderWithWrappers(<MockSortScreen initialData={injectedState} />)

      const selectedOption = selectedSortOption()
      expect(selectedOption).toHaveTextContent("Recently Added", { exact: false })
    })

    it("prefers the selected filter over the default filter", async () => {
      const injectedState: ArtworkFiltersState = {
        selectedFilters: [
          {
            displayText: "Recently Added",

            paramName: FilterParamName.sort,
            paramValue: "-published_at",
          },
        ],
        appliedFilters: [],
        previouslyAppliedFilters: [],
        applyFilters: false,
        aggregations: [],
        filterType: "artwork",
        counts: {
          total: null,
          followedArtists: null,
        },
        showFilterArtworksModal: false,
        sizeMetric: "cm",
      }

      await renderWithWrappers(<MockSortScreen initialData={injectedState} />)

      const selectedOption = selectedSortOption()
      expect(selectedOption).toHaveTextContent("Recently Added", { exact: false })
    })

    it("prefers the selected filter over an applied filter", async () => {
      const injectedState: ArtworkFiltersState = {
        selectedFilters: [
          {
            displayText: "Recently Added",

            paramName: FilterParamName.sort,
            paramValue: "-published_at",
          },
        ],
        appliedFilters: [
          {
            displayText: "Recently Updated",

            paramName: FilterParamName.sort,
            paramValue: "-partner_updated_at",
          },
        ],
        previouslyAppliedFilters: [
          {
            displayText: "Recently Updated",

            paramName: FilterParamName.sort,
            paramValue: "-partner_updated_at",
          },
        ],
        applyFilters: false,
        aggregations: [],
        filterType: "artwork",
        counts: {
          total: null,
          followedArtists: null,
        },
        showFilterArtworksModal: false,
        sizeMetric: "cm",
      }

      await renderWithWrappers(<MockSortScreen initialData={injectedState} />)

      const selectedOption = selectedSortOption()
      expect(selectedOption).toHaveTextContent("Recently Added", { exact: false })
    })
  })

  it("allows only one sort filter to be selected at a time", async () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [
        {
          displayText: "Price (High to Low)",

          paramName: FilterParamName.sort,
          paramValue: "-has_price,-prices",
        },
        {
          displayText: "Price (Low to High)",

          paramName: FilterParamName.sort,
          paramValue: "-has_price,prices",
        },
      ],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    await renderWithWrappers(<MockSortScreen initialData={injectedState} />)

    const selectedRow = selectedSortOption()
    expect(selectedRow).toHaveTextContent("Price (High to Low)")
    expect(selectedRow).toBeSelected()
  })

  describe("filterType of showArtwork", () => {
    it("has the correct options", async () => {
      const injectedState: ArtworkFiltersState = {
        selectedFilters: [],
        appliedFilters: [],
        previouslyAppliedFilters: [],
        applyFilters: false,
        aggregations: [],
        filterType: "showArtwork",
        counts: {
          total: null,
          followedArtists: null,
        },
        showFilterArtworksModal: false,
        sizeMetric: "cm",
      }

      await renderWithWrappers(<MockSortScreen initialData={injectedState} />)

      const selectedRow = selectedSortOption()

      expect(selectedRow).toHaveTextContent("Gallery Curated")
      expect(selectedRow).toBeSelected()
    })
  })

  describe("filterType of auctionResults", () => {
    it("has the correct options", async () => {
      const injectedState: ArtworkFiltersState = {
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

      await renderWithWrappers(<MockSortScreen initialData={injectedState} />)

      const selectedRow = selectedSortOption()

      expect(selectedRow).toHaveTextContent("Most Recent Sale Date")
      expect(selectedRow).toBeSelected()
    })
  })
})
