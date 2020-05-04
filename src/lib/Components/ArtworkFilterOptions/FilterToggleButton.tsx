import { color } from "@artsy/palette"
import { WaysToBuyOptions } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { ArtworkFilterContext } from "lib/utils/ArtworkFiltersStore"
import React, { useContext } from "react"
import { Switch, View } from "react-native"

interface FilterToggleButtonProps {
  onSelect: (option: WaysToBuyOptions) => void
  optionSelection: WaysToBuyOptions
}

export const FilterToggleButton: React.FC<FilterToggleButtonProps> = props => {
  const { onSelect, optionSelection } = props
  const { state } = useContext(ArtworkFilterContext)
  const handleToggle = (selectOption: (selection: WaysToBuyOptions) => void, selection: WaysToBuyOptions) => {
    selectOption(selection)
  }

  return (
    <View>
      <Switch
        trackColor={{ false: color("black10"), true: color("black100") }}
        onValueChange={() => handleToggle(onSelect, optionSelection)}
        value={state.selectedFilters.find(filter => filter.value === optionSelection) === undefined ? false : true}
      />
    </View>
  )
}
