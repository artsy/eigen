import { within } from "@testing-library/react-native"
import { FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { MockFilterScreen } from "../FilterTestHelper"
import { getEssentialProps } from "./helper"
import { WaysToBuyOptionsScreen } from "./WaysToBuyOptions"

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
    sizeMetric: "cm",
  }

  const MockWaysToBuyScreen = ({
    initialData = initialState,
  }: {
    initialData?: ArtworkFiltersState
  }) => (
    <ArtworkFiltersStoreProvider initialData={initialData}>
      <WaysToBuyOptionsScreen {...getEssentialProps()} />
    </ArtworkFiltersStoreProvider>
  )

  it("renders the correct ways to buy options", () => {
    const { getByText } = renderWithWrappers(<MockWaysToBuyScreen initialData={initialState} />)

    expect(getByText("Purchase")).toBeTruthy()
    expect(getByText("Make Offer")).toBeTruthy()
    expect(getByText("Bid")).toBeTruthy()
    expect(getByText("Contact Gallery")).toBeTruthy()
  })

  it.skip("does not display the default text when no filter selected on the filter modal screen", () => {
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
      sizeMetric: "cm",
    }

    const { getByText } = renderWithWrappers(<MockFilterScreen initialState={injectedState} />)

    expect(getByText("Ways to Buy")).toBeTruthy()
  })

  it.skip("displays the number of the selected filters on the filter modal screen", () => {
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
      sizeMetric: "cm",
    }

    const { getByText } = renderWithWrappers(<MockFilterScreen initialState={injectedState} />)
    expect(within(getByText("Ways to Buy")).getByText("• 3")).toBeTruthy()
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
      sizeMetric: "cm",
    }

    const { getAllByA11yState } = renderWithWrappers(
      <MockWaysToBuyScreen initialData={injectedState} />
    )
    const options = getAllByA11yState({ checked: true })

    expect(options).toHaveLength(1)
    expect(options[0]).toHaveTextContent("Purchase")
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
      sizeMetric: "cm",
    }

    const { getAllByA11yState } = renderWithWrappers(
      <MockWaysToBuyScreen initialData={injectedState} />
    )
    const options = getAllByA11yState({ checked: true })

    expect(options).toHaveLength(1)
    expect(options[0]).toHaveTextContent("Contact Gallery")
  })
})
