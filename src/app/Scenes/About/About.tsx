import { useTheme } from "@artsy/palette-mobile"
import { MenuItem } from "app/Components/MenuItem"
import { useToast } from "app/Components/Toast/toastHook"
import { GlobalStore } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import React, { useEffect, useState } from "react"
import { ScrollView } from "react-native"
import DeviceInfo from "react-native-device-info"
import useDebounce from "react-use/lib/useDebounce"

export const About: React.FC = () => {
  const { color } = useTheme()
  const appVersion = DeviceInfo.getVersion()
  const toast = useToast()
  const [tapCount, updateTapCount] = useState(0)
  const { value: userIsDev, flipValue: userIsDevFlipValue } = GlobalStore.useAppState(
    (store) => store.artsyPrefs.userIsDev
  )
  const showNewDisclaimer = useFeatureFlag("AREnableNewTermsAndConditions")

  useEffect(() => {
    const flip = (userIsDev && tapCount >= 3) || (!userIsDev && tapCount >= 7)
    if (flip) {
      updateTapCount((_) => 0)
      GlobalStore.actions.artsyPrefs.userIsDev.setFlipValue(!userIsDevFlipValue)
      const nextValue = !userIsDev
      if (nextValue) {
        toast.show('Developer mode enabled.\nTap "Version" three times to disable it.', "bottom")
      } else {
        toast.show("Developer mode disabled.", "bottom")
      }
    }
  }, [tapCount])

  useDebounce(
    () => {
      if (tapCount !== 0) {
        updateTapCount((_) => 0)
      }
    },
    350,
    [tapCount]
  )

  return (
    <ScrollView contentContainerStyle={{ paddingTop: 10 }}>
      <MenuItem
        title={showNewDisclaimer ? "Terms and Conditions" : "Terms of Use"}
        onPress={() => navigate("/terms")}
      />
      <MenuItem title="Privacy Policy" onPress={() => navigate("/privacy")} />
      <MenuItem
        title={showNewDisclaimer ? "Auction Supplement" : "Conditions of Sale"}
        onPress={() => navigate(showNewDisclaimer ? "/supplemental-cos" : "/conditions-of-sale")}
      />
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
