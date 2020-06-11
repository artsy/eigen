import { AggregateOption, FilterParamName, FilterType } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { ArtworkFilterContext, FilterData, useSelectedOptionsDisplay } from "lib/utils/ArtworkFiltersStore"
import React, { useContext } from "react"
import { NavigatorIOS } from "react-native"
import { aggregationFromFilterType } from "../FilterModal"
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

export const PriceRangeOptionsScreen: React.SFC<PriceRangeOptionsScreenProps> = ({ navigator }) => {
  const { dispatch, aggregations } = useContext(ArtworkFilterContext)

  const filterType = FilterType.priceRange
  const aggregationName = aggregationFromFilterType(filterType)
  const aggregation = aggregations!.filter(value => value.slice === aggregationName)[0]
  const options = aggregation.counts.map(aggCount => {
    return {
      displayText: priceRangeDisplayText.get(aggCount.value) ?? aggCount.name,
      paramName: FilterParamName.priceRange,
      paramValue: aggCount.value,
      filterType,
    }
  })
  const sortedOptions = options.sort(priceSort)
  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find(option => option.filterType === filterType)!

  const selectOption = (option: AggregateOption) => {
    dispatch({
      type: "selectFilters",
      payload: {
        displayText: option.displayText,
        paramValue: option.paramValue,
        paramName: FilterParamName.priceRange,
        filterType,
      },
    })
  }

  return (
    <SingleSelectOptionScreen
      onSelect={selectOption}
      filterHeaderText="Price Range"
      filterOptions={sortedOptions}
      selectedOption={selectedOption}
      navigator={navigator}
    />
  )
}
