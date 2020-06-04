import {
  mapWaysToBuyTypesToFilterTypes,
  OrderedWaysToBuyFilters,
} from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { ArtworkFilterContext, useSelectedOptionsDisplay } from "lib/utils/ArtworkFiltersStore"
import React, { useContext } from "react"
import { NavigatorIOS } from "react-native"
import { MultiSelectOptionScreen } from "./MultiSelectOption"

interface WaysToBuyOptionsScreenProps {
  navigator: NavigatorIOS
}

export const WaysToBuyOptionsScreen: React.SFC<WaysToBuyOptionsScreenProps> = ({ navigator }) => {
  const { dispatch } = useContext(ArtworkFilterContext)
  const selectedOptions = useSelectedOptionsDisplay()
  const waysToBuyOptions = OrderedWaysToBuyFilters.map(filterDisplayString => {
    const filterTypeId = mapWaysToBuyTypesToFilterTypes[filterDisplayString]
    const optionValues = selectedOptions.find(selectedOption => selectedOption.filterType === filterTypeId)
    return {
      toggleValue: optionValues?.value as boolean,
      filterDisplayName: filterDisplayString,
      filterType: optionValues?.filterType!,
    }
  })

  const selectOption = (filterType: string) => {
    const value = !selectedOptions.find(selectedOption => selectedOption.filterType === filterType)?.value
    dispatch({
      type: "selectFilters",
      payload: { filterType, value } as any,
    })
  }

  return (
    <MultiSelectOptionScreen
      onSelect={selectOption}
      filterHeaderText="Ways to Buy"
      filterOptions={waysToBuyOptions}
      navigator={navigator}
    />
  )
}
