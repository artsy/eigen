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

interface MediumOptionsScreenProps extends StackScreenProps<FilterModalNavigationStack, "MediumOptionsScreen"> {}

export const MediumOptionsScreen: React.FC<MediumOptionsScreenProps> = ({ navigation }) => {
  const paramName = FilterParamName.medium
  const aggregations = ArtworksFiltersStore.useStoreState((state) => state.aggregations)
  const aggregation = aggregationForFilter(paramName, aggregations)
  const options = aggregation?.counts.map((aggCount) => {
    return {
      displayText: aggCount.name,
      paramValue: aggCount.value,
      paramName,
      count: aggCount.count,
    }
  })

  const allOption: FilterData = {
    displayText: "All",
    paramName,
    paramValue: ParamDefaultValues.medium,
  }
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
      },
    })
  }

  return (
    <SingleSelectOptionScreen
      onSelect={selectOption}
      filterHeaderText={FilterDisplayName.medium}
      filterOptions={displayOptions}
      selectedOption={selectedOption}
      navigation={navigation}
      withExtraPadding
    />
  )
}
