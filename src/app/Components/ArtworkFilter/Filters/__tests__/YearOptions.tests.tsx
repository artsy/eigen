import { Text } from "@artsy/palette-mobile"
import MultiSlider from "@ptomasroos/react-native-multi-slider"
import { FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  ArtworksFiltersStore,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import {
  ALLOW_EMPTY_CREATED_DATES_FILTER,
  OptionItem,
  YearOptionsScreen,
} from "app/Components/ArtworkFilter/Filters/YearOptions"
import { getEssentialProps } from "app/Components/ArtworkFilter/Filters/helper"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { act } from "react-test-renderer"

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

  it("renders propertly", () => {
    const tree = renderWithWrappersLEGACY(<MockYearOptionsScreen initialData={initialState} />)

    expect(extractText(tree.root.findAllByType(Text)[1])).toEqual("2010 – 2021")
    expect(extractText(tree.root.findAllByType(OptionItem)[0])).toEqual(
      ALLOW_EMPTY_CREATED_DATES_FILTER.displayText
    )
  })

  it("selects the right year range and option", () => {
    const tree = renderWithWrappersLEGACY(<MockYearOptionsScreen initialData={initialState} />)

    ;(storeInstance as any).getActions().__injectState?.(initialState)

    const multiSlider = tree.root.findAllByType(MultiSlider)[0]
    const optionItem = tree.root.findAllByType(OptionItem)[0]

    act(() => {
      multiSlider.props.onValuesChangeFinish(["2011", "2020"])
      optionItem.props.onPress()
    })

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
