import { AggregateOption, FilterParamName, FilterType } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { ArtworkFilterContext, useSelectedOptionsDisplay } from "lib/utils/ArtworkFiltersStore"
import React, { useContext } from "react"
import { NavigatorIOS } from "react-native"
import { aggregationFromFilterType } from "../FilterModal"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface PriceRangeOptionsScreenProps {
  navigator: NavigatorIOS
}

export const PriceRangeOptionsScreen: React.SFC<PriceRangeOptionsScreenProps> = ({ navigator }) => {
  const { dispatch, aggregations } = useContext(ArtworkFilterContext)

  const filterType = FilterType.priceRange
  const aggregationName = aggregationFromFilterType(filterType)
  const aggregation = aggregations!.filter(value => value.slice === aggregationName)[0]
  const options = aggregation.counts.map(aggCount => {
    return {
      displayText: aggCount.name,
      paramName: FilterParamName.priceRange,
      paramValue: aggCount.value,
      filterType,
    }
  })

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
      filterOptions={options}
      selectedOption={selectedOption}
      navigator={navigator}
    />
  )
}
