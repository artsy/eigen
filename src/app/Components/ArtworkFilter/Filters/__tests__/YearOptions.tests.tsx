import { fireEvent, screen } from "@testing-library/react-native"
import { FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  ArtworksFiltersStore,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import {
  ALLOW_EMPTY_CREATED_DATES_FILTER,
  YearOptionsScreen,
} from "app/Components/ArtworkFilter/Filters/YearOptions"
import { getEssentialProps } from "app/Components/ArtworkFilter/Filters/helper"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("@ptomasroos/react-native-multi-slider", () => {
  const { View } = require("react-native")
  return (props: object) => <View testID="multi-slider" {...props} />
})

describe("Year Options Screen", () => {
  let storeInstance: ReturnType<typeof ArtworksFiltersStore.useStore>
  const initialState: ArtworkFiltersState = {
    selectedFilters: [],
    appliedFilters: [],
    previouslyAppliedFilters: [],
    applyFilters: false,
    aggregations: [
      {
        slice: "earliestCreatedYear",
        counts: [
          {
            name: "2010",
            count: 0,
            value: "2010",
          },
        ],
      },
      {
        slice: "latestCreatedYear",
        counts: [
          {
            name: "2021",
            count: 0,
            value: "2021",
          },
        ],
      },
    ],
    filterType: "auctionResult",
    counts: {
      total: null,
      followedArtists: null,
    },
    showFilterArtworksModal: false,
    sizeMetric: "cm",
  }

  const ArtworkFiltersStoreConsumer = () => {
    storeInstance = ArtworksFiltersStore.useStore()
    return null
  }

  const MockYearOptionsScreen = ({
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
      <YearOptionsScreen {...getEssentialProps()} />
      <ArtworkFiltersStoreConsumer />
    </ArtworkFiltersStoreProvider>
  )

  it("renders propertly", async () => {
    await renderWithWrappers(<MockYearOptionsScreen initialData={initialState} />)

    expect(screen.getByText("2010 – 2021")).toBeOnTheScreen()
    expect(screen.getByText(ALLOW_EMPTY_CREATED_DATES_FILTER.displayText)).toBeOnTheScreen()
  })

  it("selects the right year range and option", async () => {
    await renderWithWrappers(<MockYearOptionsScreen initialData={initialState} />)
    ;(storeInstance as any).getActions().__injectState?.(initialState)

    await fireEvent(screen.getByTestId("multi-slider"), "valuesChangeFinish", ["2011", "2020"])
    await fireEvent.press(screen.getByText(ALLOW_EMPTY_CREATED_DATES_FILTER.displayText))

    const selectedFilters = storeInstance.getState().selectedFilters
    const latestCreatedYear = selectedFilters.find(
      (selectedFilter) => selectedFilter.paramName === FilterParamName.latestCreatedYear
    )?.paramValue

    const earliestCreatedYear = selectedFilters.find(
      (selectedFilter) => selectedFilter.paramName === FilterParamName.earliestCreatedYear
    )?.paramValue
    expect(latestCreatedYear).toEqual("2020")
    expect(earliestCreatedYear).toEqual("2011")
  })
})
