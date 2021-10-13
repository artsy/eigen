import { Flex, Text, useColor } from "palette"
import React from "react"
import { Platform, Switch } from "react-native"

export interface ToggleProps {
  onChange: (value: boolean) => void
  active: boolean
  label: string
  description?: string
}

export const Toggle = ({ onChange, active, label }: ToggleProps) => {
  const color = useColor()
  let thumbColor = color("white100")
  let disabledTrackColor = color("black30")
  let enabledTrackColor = color("blue100")

  if (Platform.OS === "android") {
    if (active) {
      thumbColor = color("blue100")
      enabledTrackColor = color("blue10")
    } else {
      thumbColor = color("black10")
      disabledTrackColor = color("black30")
    }
  }

  return (
    <Flex flexDirection="row" alignItems="center" py={1}>
      <Flex flex={1} mr={2}>
        <Text numberOfLines={1}>{label}</Text>
      </Flex>
      <Switch
        accessibilityRole="switch"
        accessibilityLabel={`${label} Toggler`}
        accessibilityState={{ selected: active }}
        thumbColor={thumbColor}
        trackColor={{ false: disabledTrackColor, true: enabledTrackColor }}
        onValueChange={onChange}
        value={active}
      />
    </Flex>
  )
}
