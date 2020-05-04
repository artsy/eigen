import { color } from "@artsy/palette"
import { WaysToBuyOptions } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import React, { useState } from "react"
import { Switch, View } from "react-native"

interface FilterToggleButtonProps {
  onSelect: (option: WaysToBuyOptions) => void
  optionSelection: WaysToBuyOptions
}

export const FilterToggleButton: React.FC<FilterToggleButtonProps> = props => {
  const { onSelect, optionSelection } = props

  const [isSwitchEnabled, setIsSwitchEnabled] = useState(false)

  const handleToggle = (selectOption: (selection: WaysToBuyOptions) => void, selection: WaysToBuyOptions) => {
    setIsSwitchEnabled(!isSwitchEnabled)

    selectOption(selection)
  }

  return (
    <View>
      <Switch
        trackColor={{ false: color("black10"), true: color("black100") }}
        onValueChange={() => handleToggle(onSelect, optionSelection)}
        value={isSwitchEnabled}
      />
    </View>
  )
}
