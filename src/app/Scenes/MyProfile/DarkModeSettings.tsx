import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { SwitchMenu } from "app/Components/SwitchMenu"
import { GlobalStore } from "app/store/GlobalStore"
import { Flex, Text } from "palette"
import React from "react"

export function DarkModeSettings() {
  const syncWithSystem = GlobalStore.useAppState(
    (state) => state.devicePrefs.usingSystemColorScheme
  )
  const forceMode = GlobalStore.useAppState((state) => state.devicePrefs.forcedColorScheme)

  return (
    <PageWithSimpleHeader title="Dark Mode Settings">
      <Text variant="lg" textAlign="center">
        Choose your destiny
      </Text>
      <Flex mx="2" mt="2">
        <SwitchMenu
          title="Sync with system"
          description="Automatically turn dark mode on or off based on the system's dark mode setting."
          value={syncWithSystem}
          onChange={(value) => {
            GlobalStore.actions.devicePrefs.setUsingSystemColorScheme(value)
          }}
        />
        <SwitchMenu
          title="Dark Mode always on"
          description="Always use Dark Mode."
          value={forceMode === "dark"}
          disabled={syncWithSystem}
          onChange={(value) => {
            GlobalStore.actions.devicePrefs.setForcedColorScheme(value ? "dark" : "light")
          }}
        />
      </Flex>
    </PageWithSimpleHeader>
  )
}
