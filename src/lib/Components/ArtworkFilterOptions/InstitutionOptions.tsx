import { StackScreenProps } from "@react-navigation/stack"
import {
  ArtworkFilterContext,
  FilterData,
  ParamDefaultValues,
  useSelectedOptionsDisplay,
} from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import {
  AggregateOption,
  aggregationForFilter,
  FilterDisplayName,
  FilterParamName,
} from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import React, { useContext } from "react"
import { FilterModalNavigationStack } from "../FilterModal"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface InstitutionOptionsScreenProps
  extends StackScreenProps<FilterModalNavigationStack, "InstitutionOptionsScreen"> {}

export const InstitutionOptionsScreen: React.FC<InstitutionOptionsScreenProps> = ({ navigation }) => {
  const { dispatch, state } = useContext(ArtworkFilterContext)

  const paramName = FilterParamName.institution
  const filterKey = "institution"
  const aggregation = aggregationForFilter(filterKey, state.aggregations)
  const options = aggregation?.counts.map((aggCount) => {
    return {
      displayText: aggCount.name,
      paramName,
      paramValue: aggCount.value,
      filterKey,
    }
  })
  const allOption: FilterData = { displayText: "All", paramName, filterKey, paramValue: ParamDefaultValues.partnerID }
  const displayOptions = [allOption].concat(options ?? [])
  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find((option) => option.paramName === paramName)!

  const selectOption = (option: AggregateOption) => {
    dispatch({
      type: "selectFilters",
      payload: {
        displayText: option.displayText,
        paramValue: option.paramValue,
        paramName,
        filterKey,
      },
    })
  }

  return (
    <SingleSelectOptionScreen
      onSelect={selectOption}
      filterHeaderText={FilterDisplayName.institution}
      filterOptions={displayOptions}
      selectedOption={selectedOption}
      navigation={navigation}
    />
  )
}
