import {
  ArtworkFilterContext,
  FilterData,
  useSelectedOptionsDisplay,
} from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import {
  AggregateOption,
  aggregationForFilter,
  FilterDisplayName,
  FilterParamName,
} from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import React, { useContext } from "react"
import NavigatorIOS from "react-native-navigator-ios"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface PriceRangeOptionsScreenProps {
  navigator: NavigatorIOS
}

const priceRangeDisplayText: Map<string, string> = new Map([
  ["*-*", "All"],
  ["*-1000", "$0-1,000"],
  ["1000-5000", "$1000-5,000"],
  ["5000-10000", "$5,000-10,000"],
  ["10000-50000", "$10,000-50,000"],
  ["50000-*", "$50,000+"],
])

const priceSort = (left: FilterData, right: FilterData): number => {
  const sortOrder = ["*-*", "*-1000", "1000-5000", "5000-10000", "10000-50000", "50000-*"]
  const leftParam = left.paramValue as string
  const rightParam = right.paramValue as string
  if (sortOrder.indexOf(leftParam) < sortOrder.indexOf(rightParam)) {
    return -1
  } else {
    return 1
  }
}

export const PriceRangeOptionsScreen: React.FC<PriceRangeOptionsScreenProps> = ({ navigator }) => {
  const { dispatch, state } = useContext(ArtworkFilterContext)

  const paramName = FilterParamName.priceRange
  const aggregation = aggregationForFilter(paramName, state.aggregations)
  const options = aggregation?.counts.map((aggCount) => {
    return {
      displayText: priceRangeDisplayText.get(aggCount.value) ?? aggCount.name,
      paramName,
      paramValue: aggCount.value,
    }
  })
  const sortedOptions = options?.sort(priceSort) ?? []
  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find((option) => option.paramName === paramName)!

  const selectOption = (option: AggregateOption) => {
    dispatch({
      type: "selectFilters",
      payload: {
        displayText: option.displayText,
        paramValue: option.paramValue,
        paramName,
      },
    })
  }

  return (
    <SingleSelectOptionScreen
      onSelect={selectOption}
      filterHeaderText={FilterDisplayName.priceRange}
      filterOptions={sortedOptions}
      selectedOption={selectedOption}
      navigator={navigator}
    />
  )
}
