import { FilterData, NewStore, ParamDefaultValues } from "lib/Components/ArtworkFilter/ArtworkFiltersStore"
import { FilterDisplayName, FilterParamName } from "lib/Components/ArtworkFilter/FilterArtworksHelpers"
import _ from "lodash"
import React from "react"
import { NavigatorIOS } from "react-native"
import { aggregationForFilter } from "../FilterModal"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface TimePeriodOptionsScreenProps {
  navigator: NavigatorIOS
}

export const TimePeriodOptionsScreen: React.FC<TimePeriodOptionsScreenProps> = ({ navigator }) => {
  // TODO: a lot of redundant types, see if we can clean up
  const displayValue: Record<string, string> = {
    "2020": "2020-today",
    "2010": "2010-2019",
    "2000": "2000-2009",
    "1990": "1990-1999",
    "1980": "1980-1989",
    "1970": "1970-1979",
    "1960": "1960-1969",
    "1950": "1950-1959",
    "1940": "1940-1949",
    "1930": "1930-1939",
    "1920": "1920-1929",
    "1910": "1910-1919",
    "1900": "1900-1909",
    "Late 19th Century": "Late 19th Century",
    "Mid 19th Century": "Mid 19th Century",
    "Early 19th Century": "Early 19th Century",
  }

  const paramName = FilterParamName.timePeriod

  const selectedFilters = NewStore.useStoreState((state) => state.selectedFiltersComputed)
  const selectedFilter = selectedFilters.majorPeriods

  const updateValue = NewStore.useStoreActions((actions) => actions.selectFilter)
  const aggregations = NewStore.useStoreState((state) => state.aggregations)

  const aggregation = aggregationForFilter(paramName, aggregations)
  const options = aggregation?.counts.map((aggCount) => aggCount.value) ?? []
  const aggFilterOptions: FilterData[] = _.compact(
    options.map((value) => {
      const displayText = displayValue[value]
      if (Boolean(displayText)) {
        return { displayText, paramValue: value, paramName }
      } else {
        // Default to paramValue if not accounted for
        return { displayText: value, paramValue: value, paramName }
      }
    })
  )
  const allOption: FilterData = { displayText: "All", paramName, paramValue: ParamDefaultValues.majorPeriods }
  const filterOptions = [allOption].concat(aggFilterOptions)

  const selectedOption = filterOptions.find((option) => option.paramValue === selectedFilter) ?? allOption

  const selectOption = (option: FilterData) => {
    updateValue({
      paramName: option.paramName,
      value: option.paramValue!,
      display: option.displayText,
      filterScreenType: "majorPeriods",
    })
  }

  return (
    <SingleSelectOptionScreen
      onSelect={selectOption}
      filterHeaderText={FilterDisplayName.timePeriod}
      filterOptions={filterOptions}
      selectedOption={selectedOption}
      navigator={navigator}
    />
  )
}
