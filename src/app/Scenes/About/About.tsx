import { MenuItem } from "app/Components/MenuItem"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { useToast } from "app/Components/Toast/toastHook"
import { navigate } from "app/navigation/navigate"
import { GlobalStore } from "app/store/GlobalStore"
import { useTheme } from "palette"
import React, { useEffect, useState } from "react"
import { useIntl } from "react-intl"
import { ScrollView } from "react-native"
import { getVersion } from "react-native-device-info"
import useDebounce from "react-use/lib/useDebounce"

export const About: React.FC = () => {
  const { color } = useTheme()
  const appVersion = getVersion()
  const toast = useToast()
  const [tapCount, updateTapCount] = useState(0)
  const { value: userIsDev, flipValue: userIsDevFlipValue } = GlobalStore.useAppState(
    (store) => store.artsyPrefs.userIsDev
  )
  const intl = useIntl()

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
    <PageWithSimpleHeader
      title={intl.formatMessage({ id: "scene.about.about", defaultMessage: "About" })}
    >
      <ScrollView contentContainerStyle={{ paddingTop: 10 }}>
        <MenuItem
          title={intl.formatMessage({
            id: "scene.about.termsOfUse",
            defaultMessage: "Terms of Use",
          })}
          onPress={() => navigate("/terms", { modal: true })}
        />
        <MenuItem
          title={intl.formatMessage({
            id: "scene.about.privacyPolicy",
            defaultMessage: "Privacy Policy",
          })}
          onPress={() => navigate("/privacy", { modal: true })}
        />
        <MenuItem
          title={intl.formatMessage({
            id: "scene.about.conditionsOfSale",
            defaultMessage: "Conditions of Sale",
          })}
          onPress={() => navigate("/conditions-of-sale", { modal: true })}
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
    </PageWithSimpleHeader>
  )
}
