import { StackScreenProps } from "@react-navigation/stack"
import {
  ArtworkFilterContext,
  FilterData,
  useSelectedOptionsDisplay,
} from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import {
  AggregateOption,
  FilterDisplayName,
  FilterParamName,
  ViewAsValues,
} from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import React, { useContext } from "react"
import { FilterModalNavigationStack } from "../FilterModal"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface ViewAsOptionsScreenProps extends StackScreenProps<FilterModalNavigationStack, "WaysToBuyOptionsScreen"> {}

export const ViewAsOptionsScreen: React.FC<ViewAsOptionsScreenProps> = ({ navigation }) => {
  const { dispatch } = useContext(ArtworkFilterContext)

  const paramName = FilterParamName.viewAs

  const gridOption: FilterData = { displayText: "Grid", paramName, paramValue: ViewAsValues.Grid }
  const listOption: FilterData = { displayText: "List", paramName, paramValue: ViewAsValues.List }

  const viewAsOptions = [gridOption, listOption]

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
      filterHeaderText={FilterDisplayName.viewAs}
      filterOptions={viewAsOptions}
      selectedOption={selectedOption}
      navigation={navigation}
    />
  )
}
