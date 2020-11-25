import {
  ArtworkFilterContext,
  FilterData,
  ParamDefaultValues,
  useSelectedOptionsDisplay,
} from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { aggregationForFilter, FilterDisplayName, FilterParamName } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import _ from "lodash"
import React, { useContext } from "react"
import NavigatorIOS from "react-native-navigator-ios"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface TimePeriodOptionsScreenProps {
  navigator: NavigatorIOS
}

export const TimePeriodOptionsScreen: React.FC<TimePeriodOptionsScreenProps> = ({ navigator }) => {
  const { dispatch, state } = useContext(ArtworkFilterContext)

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
  const aggregation = aggregationForFilter(paramName, state.aggregations)
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

  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find((option) => option.paramName === paramName)!

  const selectOption = (option: FilterData) => {
    dispatch({ type: "selectFilters", payload: option })
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
