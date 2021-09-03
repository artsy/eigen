import { MenuItem } from "lib/Components/MenuItem"
import { Text } from "palette"
import React from "react"
import { Alert } from "react-native"
import create from "zustand"

interface PaletteFlagState {
  allowV3: boolean
  setAllowV3: (value: boolean) => void
  toggleAllowV3: () => void
}

export const usePaletteFlagStore = create<PaletteFlagState>((set) => ({
  allowV3: true,
  setAllowV3: (value) => set((_state) => ({ allowV3: value })),
  toggleAllowV3: () => set((state) => ({ allowV3: !state.allowV3 })),
}))

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
