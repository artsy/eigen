import { screen } from "@testing-library/react-native"
import { FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { MockFilterScreen } from "app/Components/ArtworkFilter/FilterTestHelper"
import { WaysToBuyOptionsScreen } from "app/Components/ArtworkFilter/Filters/WaysToBuyOptions"
import { getEssentialProps } from "app/Components/ArtworkFilter/Filters/helper"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("Ways to Buy Options Screen", () => {
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

  const MockWaysToBuyScreen = ({
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
      <WaysToBuyOptionsScreen {...getEssentialProps()} />
    </ArtworkFiltersStoreProvider>
  )

  it("renders the correct ways to buy options", () => {
    renderWithWrappers(<MockWaysToBuyScreen initialData={initialState} />)

    expect(screen.getByText("Purchase")).toBeTruthy()
    expect(screen.getByText("Make Offer")).toBeTruthy()
    expect(screen.getByText("Bid")).toBeTruthy()
    expect(screen.getByText("Contact Gallery")).toBeTruthy()
  })

  it("does not display the default text when no filter selected on the filter modal screen", () => {
    const injectedState: ArtworkFiltersState = {
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

    renderWithWrappers(<MockFilterScreen initialState={injectedState} />)

    expect(screen.getByText("Ways to Buy")).toBeOnTheScreen()
  })

  it("displays the number of the selected filters on the filter modal screen", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [
        {
          displayText: "Purchase",
          paramName: FilterParamName.waysToBuyPurchase,
          paramValue: true,
        },
        {
          displayText: "Contact Gallery",
          paramName: FilterParamName.waysToBuyContactGallery,
          paramValue: true,
        },
        {
          displayText: "Bid",
          paramName: FilterParamName.waysToBuyBid,
          paramValue: true,
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

    renderWithWrappers(<MockFilterScreen initialState={injectedState} />)

    expect(screen.getByText("Ways to Buy • 3")).toBeOnTheScreen()
  })

  it("toggles selected filters 'ON' and unselected filters 'OFF", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [
        {
          displayText: "Purchase",
          paramName: FilterParamName.waysToBuyPurchase,
          paramValue: true,
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

    renderWithWrappers(<MockWaysToBuyScreen initialData={injectedState} />)

    const options = screen.getAllByTestId("multi-select-option-button")
    const checkboxes = screen.getAllByTestId("multi-select-option-checkbox")

    expect(options).toHaveLength(4)
    expect(checkboxes).toHaveLength(4)

    expect(options[0]).toHaveTextContent("Purchase")
    expect(options[1]).toHaveTextContent("Make Offer")
    expect(options[2]).toHaveTextContent("Bid")
    expect(options[3]).toHaveTextContent("Contact Gallery")

    expect(checkboxes[0]).toHaveProp("selected", true)
    expect(checkboxes[1]).toHaveProp("selected", false)
    expect(checkboxes[2]).toHaveProp("selected", false)
    expect(checkboxes[3]).toHaveProp("selected", false)
  })

  it("it toggles applied filters 'ON' and unapplied filters 'OFF", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [],
      appliedFilters: [
        {
          displayText: "Contact Gallery",
          paramName: FilterParamName.waysToBuyContactGallery,
          paramValue: true,
        },
      ],
      previouslyAppliedFilters: [
        {
          displayText: "Contact Gallery",
          paramName: FilterParamName.waysToBuyContactGallery,
          paramValue: true,
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

    renderWithWrappers(<MockWaysToBuyScreen initialData={injectedState} />)

    const options = screen.getAllByTestId("multi-select-option-button")
    const checkboxes = screen.getAllByTestId("multi-select-option-checkbox")

    expect(options).toHaveLength(4)
    expect(checkboxes).toHaveLength(4)

    expect(options[0]).toHaveTextContent("Purchase")
    expect(options[1]).toHaveTextContent("Make Offer")
    expect(options[2]).toHaveTextContent("Bid")
    expect(options[3]).toHaveTextContent("Contact Gallery")

    expect(checkboxes[0]).toHaveProp("selected", false)
    expect(checkboxes[1]).toHaveProp("selected", false)
    expect(checkboxes[2]).toHaveProp("selected", false)
    expect(checkboxes[3]).toHaveProp("selected", true)
  })
})
