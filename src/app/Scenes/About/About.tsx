import { useTheme } from "@artsy/palette-mobile"
import { MenuItem } from "app/Components/MenuItem"
import { GlobalStore } from "app/store/GlobalStore"
import { useSetDevMode } from "app/system/devTools/useSetDevMode"
import React from "react"
import { ScrollView } from "react-native"
import DeviceInfo from "react-native-device-info"

export const About: React.FC = () => {
  const { color } = useTheme()
  const appVersion = DeviceInfo.getVersion()
  const { value: userIsDev } = GlobalStore.useAppState((store) => store.artsyPrefs.userIsDev)

  const { updateTapCount } = useSetDevMode()

  return (
    <ScrollView contentContainerStyle={{ paddingTop: 10 }}>
      <MenuItem href="/terms" title="Terms and Conditions" />
      <MenuItem href="/privacy" title="Privacy Policy" />
      <MenuItem href="/supplemental-cos" title="Auction Supplement" />
      <MenuItem
        title="Version"
        text={appVersion}
        onPress={() => updateTapCount((count) => count + 1)}
        chevron={false}
        style={
          userIsDev ? { borderRightColor: color("devpurple"), borderRightWidth: 1 } : undefined
        }
      />
    </ScrollView>
  )
}
