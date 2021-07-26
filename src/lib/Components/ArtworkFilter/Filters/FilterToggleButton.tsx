import { useColor } from "palette/hooks"
import React from "react"
import { Switch, View } from "react-native"

interface FilterToggleButtonProps {
  onChange: () => void
  value: boolean
  disabled: boolean
}

export const FilterToggleButton: React.FC<FilterToggleButtonProps> = (props) => {
  const { onChange, value, disabled } = props
  const color = useColor()

  return (
    <View>
      <Switch
        trackColor={{ false: color("black10"), true: color("black100") }}
        onValueChange={onChange}
        value={value}
        disabled={disabled}
      />
    </View>
  )
}
