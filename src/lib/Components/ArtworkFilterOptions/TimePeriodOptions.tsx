import {
  FilterOption,
  OrderedTimePeriodFilters,
  TimePeriodOption,
} from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { ArtworkFilterContext, useSelectedOptionsDisplay } from "lib/utils/ArtworkFiltersStore"
import React, { useContext } from "react"
import { NavigatorIOS } from "react-native"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface TimePeriodOptionsScreenProps {
  navigator: NavigatorIOS
}

export const TimePeriodOptionsScreen: React.SFC<TimePeriodOptionsScreenProps> = ({ navigator }) => {
  const { dispatch } = useContext(ArtworkFilterContext)

  const filterType: FilterOption = "majorPeriods"

  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find(option => option.filterType === filterType)?.value! as TimePeriodOption

  const selectOption = (option: TimePeriodOption) => {
    dispatch({ type: "selectFilters", payload: { value: option, filterType } })
  }

  return (
    <SingleSelectOptionScreen
      onSelect={selectOption}
      filterText="Time Period"
      filterOptions={OrderedTimePeriodFilters}
      selectedOption={selectedOption}
      navigator={navigator}
    />
  )
}
