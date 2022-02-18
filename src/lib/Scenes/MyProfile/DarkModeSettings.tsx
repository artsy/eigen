import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { SwitchMenu } from "lib/Components/SwitchMenu"
import { GlobalStore } from "lib/store/GlobalStore"
import { Flex, Text } from "palette"
import React from "react"

export function DarkModeSettings() {
  const syncWithSystem = GlobalStore.useAppState((state) => state.settings.darkModeSyncWithSystem)
  const forceMode = GlobalStore.useAppState((state) => state.settings.darkModeForceMode)

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
            GlobalStore.actions.settings.setDarkModeSyncWithSystem(value)
          }}
        />
        <SwitchMenu
          title="Dark Mode always on"
          description="Always use Dark Mode."
          value={forceMode === "dark"}
          disabled={syncWithSystem}
          onChange={(value) => {
            GlobalStore.actions.settings.setDarkModeForceMode(value ? "dark" : "light")
          }}
        />
      </Flex>
    </PageWithSimpleHeader>
  )
}
