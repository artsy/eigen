import { RadioDot } from "@artsy/palette-mobile"
import { FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersStoreProvider,
  ArtworkFiltersState,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import {
  InnerOptionListItem,
  OptionListItem,
} from "app/Components/ArtworkFilter/Filters/SingleSelectOption"
import { SortOptionsScreen } from "app/Components/ArtworkFilter/Filters/SortOptions"
import { getEssentialProps } from "app/Components/ArtworkFilter/Filters/helper"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { ReactTestRenderer } from "react-test-renderer"

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

  const selectedSortOption = (componentTree: ReactTestRenderer) => {
    const innerOptions = componentTree.root.findAllByType(InnerOptionListItem)
    const selectedOption = innerOptions.filter(
      (item) => item.findByType(RadioDot).props.selected
    )[0]
    return selectedOption
  }

  it("renders the correct number of sort options", () => {
    const tree = renderWithWrappersLEGACY(<MockSortScreen initialData={initialState} />)
    expect(tree.root.findAllByType(OptionListItem)).toHaveLength(7)
  })

  describe("selectedSortOption", () => {
    it("returns the default option if there are no selected or applied filters", () => {
      const tree = renderWithWrappersLEGACY(<MockSortScreen initialData={initialState} />)
      const selectedOption = selectedSortOption(tree)
      expect(extractText(selectedOption)).toContain("Recommended")
    })

    it("prefers an applied filter over the default filter", () => {
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

      const tree = renderWithWrappersLEGACY(<MockSortScreen initialData={injectedState} />)

      const selectedOption = selectedSortOption(tree)
      expect(extractText(selectedOption)).toContain("Recently Added")
    })

    it("prefers the selected filter over the default filter", () => {
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

      const tree = renderWithWrappersLEGACY(<MockSortScreen initialData={injectedState} />)

      const selectedOption = selectedSortOption(tree)
      expect(extractText(selectedOption)).toContain("Recently Added")
    })

    it("prefers the selected filter over an applied filter", () => {
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

      const tree = renderWithWrappersLEGACY(<MockSortScreen initialData={injectedState} />)

      const selectedOption = selectedSortOption(tree)
      expect(extractText(selectedOption)).toContain("Recently Added")
    })
  })

  it("allows only one sort filter to be selected at a time", () => {
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

    const tree = renderWithWrappersLEGACY(<MockSortScreen initialData={injectedState} />)

    const selectedRow = selectedSortOption(tree)
    expect(extractText(selectedRow)).toEqual("Price (High to Low)")
    expect(selectedRow.findByType(RadioDot).props.selected).toEqual(true)
  })

  describe("filterType of showArtwork", () => {
    it("has the correct options", () => {
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

      const tree = renderWithWrappersLEGACY(<MockSortScreen initialData={injectedState} />)

      const selectedRow = selectedSortOption(tree)

      expect(extractText(selectedRow)).toEqual("Gallery Curated")
      expect(selectedRow.findByType(RadioDot).props.selected).toEqual(true)
    })
  })

  describe("filterType of auctionResults", () => {
    it("has the correct options", () => {
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

      const tree = renderWithWrappersLEGACY(<MockSortScreen initialData={injectedState} />)

      const selectedRow = selectedSortOption(tree)

      expect(extractText(selectedRow)).toEqual("Most Recent Sale Date")
      expect(selectedRow.findByType(RadioDot).props.selected).toEqual(true)
    })
  })
})
