import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "app/Components/ArtworkFilter"
import {
  AggregateOption,
  FilterDisplayName,
  FilterParamName,
  ViewAsValues,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { FilterData } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworksFiltersStore,
  useSelectedOptionsDisplay,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import React from "react"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface ViewAsOptionsScreenProps
  extends StackScreenProps<ArtworkFilterNavigationStack, "WaysToBuyOptionsScreen"> {}

export const ViewAsOptionsScreen: React.FC<ViewAsOptionsScreenProps> = ({ navigation }) => {
  const selectFiltersAction = ArtworksFiltersStore.useStoreActions(
    (action) => action.selectFiltersAction
  )

  const paramName = FilterParamName.viewAs

  const gridOption: FilterData = { displayText: "Grid", paramName, paramValue: ViewAsValues.Grid }
  const listOption: FilterData = { displayText: "List", paramName, paramValue: ViewAsValues.List }

  const viewAsOptions = [gridOption, listOption]

  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find((option) => option.paramName === paramName)!

  const selectOption = (option: AggregateOption) => {
    selectFiltersAction({
      displayText: option.displayText,
      paramValue: option.paramValue,
      paramName,
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
