import { MenuItem } from "app/Components/MenuItem"
import { useSetDevMode } from "app/system/devTools/useSetDevMode"
import React from "react"
import { ScrollView } from "react-native"
import { getAppVersion } from "app/utils/appVersion"

export const About: React.FC = () => {
  const appVersion = getAppVersion()

  const { updateTapCount } = useSetDevMode()

  return (
    <ScrollView contentContainerStyle={{ paddingTop: 10 }}>
      <MenuItem href="/terms" title="Terms and Conditions" />
      <MenuItem href="/privacy" title="Privacy Policy" />
      <MenuItem href="/supplemental-cos" title="Auction Supplement" />
      <MenuItem
        title="Version"
        value={appVersion}
        onPress={() => updateTapCount((count) => count + 1)}
        hideShevron
      />
    </ScrollView>
  )
}
