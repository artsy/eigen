import { FilterOption, OrderedSizeFilters, SizeOption } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { ArtworkFilterContext, useSelectedOptionsDisplay } from "lib/utils/ArtworkFiltersStore"
import React, { useContext } from "react"
import { NavigatorIOS } from "react-native"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface SizeOptionsScreenProps {
  navigator: NavigatorIOS
}

export const SizeOptionsScreen: React.SFC<SizeOptionsScreenProps> = ({ navigator }) => {
  const { dispatch } = useContext(ArtworkFilterContext)

  const filterType: FilterOption = "dimensionRange"

  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find(option => option.filterType === filterType)?.value! as SizeOption

  const selectOption = (option: SizeOption) => {
    dispatch({ type: "selectFilters", payload: { value: option, filterType } })
  }

  return (
    <SingleSelectOptionScreen
      onSelect={selectOption}
      filterHeaderText="Size"
      filterOptions={OrderedSizeFilters}
      selectedOption={selectedOption}
      navigator={navigator}
    />
  )
}
