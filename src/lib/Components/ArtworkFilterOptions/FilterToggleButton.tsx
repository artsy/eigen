import { color } from "@artsy/palette"
import { mapWaysToBuyTypesToFilterTypes, WaysToBuyOptions } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { useSelectedOptionsDisplay } from "lib/utils/ArtworkFiltersStore"
import React from "react"
import { Switch, View } from "react-native"

interface FilterToggleButtonProps {
  onSelect: (option: WaysToBuyOptions) => void
  filterOption: WaysToBuyOptions
}

export const FilterToggleButton: React.FC<FilterToggleButtonProps> = props => {
  const { onSelect, filterOption } = props
  const handleToggle = (selectOption: (selection: WaysToBuyOptions) => void, selection: WaysToBuyOptions) => {
    selectOption(selection)
  }

  const selectedOptions = useSelectedOptionsDisplay()

  return (
    <View>
      <Switch
        trackColor={{ false: color("black10"), true: color("black100") }}
        onValueChange={() => handleToggle(onSelect, filterOption)}
        value={
          selectedOptions.find(filter => filter.filterType === mapWaysToBuyTypesToFilterTypes[filterOption])
            ?.value as boolean
        }
      />
    </View>
  )
}
