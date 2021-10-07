import { Flex, Text, useColor } from "palette"
import React from "react"
import { Switch } from "react-native"

export interface ToggleProps {
  onChange: (value: boolean) => void
  active: boolean
  label: string
  description?: string
}

export const Toggle = ({ onChange, active, label }: ToggleProps) => {
  const color = useColor()

  return (
    <Flex flexDirection="row" alignItems="center" py={1}>
      <Flex flex={1} mr={2}>
        <Text numberOfLines={1}>{label}</Text>
      </Flex>
      <Switch
        accessibilityRole="switch"
        accessibilityLabel={`${label} Toggler`}
        accessibilityState={{ selected: active }}
        trackColor={{ false: color("black10"), true: color("blue100") }}
        onValueChange={onChange}
        value={active}
      />
    </Flex>
  )
}
