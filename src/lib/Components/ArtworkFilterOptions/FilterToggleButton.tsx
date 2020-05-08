import { color } from "@artsy/palette"
import { mapToFilterTypes, WaysToBuyOptions } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { useSelectedOptionsDisplay } from "lib/utils/ArtworkFiltersStore"
import React from "react"
import { Switch, View } from "react-native"

interface FilterToggleButtonProps {
  onSelect: (option: WaysToBuyOptions) => void
  optionSelection: WaysToBuyOptions
}

export const FilterToggleButton: React.FC<FilterToggleButtonProps> = props => {
  const { onSelect, optionSelection } = props
  const handleToggle = (selectOption: (selection: WaysToBuyOptions) => void, selection: WaysToBuyOptions) => {
    selectOption(selection)
  }

  const selectedOptions = useSelectedOptionsDisplay()

  return (
    <View>
      <Switch
        trackColor={{ false: color("black10"), true: color("black100") }}
        onValueChange={() => handleToggle(onSelect, optionSelection)}
        value={
          selectedOptions.find(filter => filter.filterType === mapToFilterTypes[optionSelection])?.value as boolean
        }
      />
    </View>
  )
}
