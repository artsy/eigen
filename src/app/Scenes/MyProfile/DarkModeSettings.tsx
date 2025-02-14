import { Flex } from "@artsy/palette-mobile"
import { SwitchMenu } from "app/Components/SwitchMenu"
import { GlobalStore } from "app/store/GlobalStore"
import { LayoutAnimation, ScrollView } from "react-native"

export function DarkModeSettings() {
  const syncWithSystem = GlobalStore.useAppState(
    (state) => state.devicePrefs.usingSystemColorScheme
  )
  const forceMode = GlobalStore.useAppState((state) => state.devicePrefs.forcedColorScheme)

  return (
    <ScrollView>
      <Flex px={2} mt={2}>
        <SwitchMenu
          title="Sync with system"
          description="Automatically turn dark mode on or off based on the system's dark mode setting."
          value={syncWithSystem}
          onChange={(value) => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
            GlobalStore.actions.devicePrefs.setUsingSystemColorScheme(value)
          }}
        />
        <SwitchMenu
          title="Dark Mode always on"
          description="Always use Dark Mode."
          value={forceMode === "dark"}
          disabled={syncWithSystem}
          onChange={(value) => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
            GlobalStore.actions.devicePrefs.setForcedColorScheme(value ? "dark" : "light")
          }}
        />
      </Flex>
    </ScrollView>
  )
}
