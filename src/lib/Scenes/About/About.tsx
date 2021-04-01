import { MenuItem } from "lib/Components/MenuItem"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { useToast } from "lib/Components/Toast/toastHook"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { navigate } from "lib/navigation/navigate"
import { GlobalStore, useFeatureFlag } from "lib/store/GlobalStore"
import { color } from "palette"
import React, { useEffect, useState } from "react"
import { ScrollView } from "react-native"
import useDebounce from "react-use/lib/useDebounce"

export const About: React.FC = () => {
  const toast = useToast()
  const [tapCount, updateTapCount] = useState(0)
  const userIsDev = useFeatureFlag("ARUserIsDev")

  useEffect(() => {
    const flip = (userIsDev && tapCount >= 3) || (!userIsDev && tapCount >= 7)
    if (flip) {
      updateTapCount((_) => 0)
      const nextValue = !userIsDev
      GlobalStore.actions.config.features.setAdminOverride({ key: "ARUserIsDev", value: nextValue })
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
    <PageWithSimpleHeader title="About">
      <ScrollView contentContainerStyle={{ paddingTop: 10 }}>
        <MenuItem title="Terms of Use" onPress={() => navigate("/terms", { modal: true })} />
        <MenuItem title="Privacy Policy" onPress={() => navigate("/privacy", { modal: true })} />
        <MenuItem
          title="Version"
          text={LegacyNativeModules.ARTemporaryAPIModule.appVersion}
          onPress={() => updateTapCount((tapCount) => tapCount + 1)}
          chevron={false}
          style={userIsDev ? { borderRightColor: color("purple100"), borderRightWidth: 1 } : undefined}
        />
      </ScrollView>
    </PageWithSimpleHeader>
  )
}
