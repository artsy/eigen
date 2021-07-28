import { MenuItem } from "lib/Components/MenuItem"
import { Text } from "palette"
import React from "react"
import { Alert } from "react-native"
import { usePaletteFlagStore } from "./PaletteFlagStore"

export const DevTogglePaletteFlag = () => {
  const currentValue = usePaletteFlagStore((state) => state.allowV3)
  const setValue = usePaletteFlagStore((state) => state.setAllowV3)

  const description = "Allow Palette V3"
  const valText = currentValue ? "Yes" : "No"

  return (
    <MenuItem
      title={description}
      onPress={() => {
        Alert.alert(description, undefined, [
          {
            text: currentValue ? "Keep turned ON" : "Turn ON",
            onPress: () => setValue(true),
          },
          {
            text: currentValue ? "Turn OFF" : "Keep turned OFF",
            onPress: () => setValue(false),
          },
        ])
      }}
      value={
        currentValue ? (
          <Text variant="subtitle" color="black100" fontWeight="bold">
            {valText}
          </Text>
        ) : (
          <Text variant="subtitle" color="black100">
            {valText}
          </Text>
        )
      }
    />
  )
}
