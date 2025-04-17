import { Text } from "@artsy/palette-mobile"
import { useToast } from "app/Components/Toast/toastHook"
import { GlobalStore } from "app/store/GlobalStore"
import { DevToggleName, devToggles } from "app/store/config/features"
import { DevMenuButtonItem } from "app/system/devTools/DevMenu/Components/DevMenuButtonItem"
import { Alert } from "react-native"

export const DevToggleItem: React.FC<{ toggleKey: DevToggleName }> = ({ toggleKey }) => {
  const config = GlobalStore.useAppState((s) => s.artsyPrefs)
  const currentValue = config.features.devToggles[toggleKey]
  const valText = currentValue ? "Yes" : "No"
  const description = devToggles[toggleKey].description
  const toast = useToast()

  return (
    <DevMenuButtonItem
      title={description}
      onPress={() => {
        Alert.alert(description, undefined, [
          {
            text: currentValue ? "Keep turned ON" : "Turn ON",
            onPress() {
              GlobalStore.actions.artsyPrefs.features.setLocalOverride({
                key: toggleKey,
                value: true,
              })
              devToggles[toggleKey].onChange?.(true, { toast })
            },
          },
          {
            text: currentValue ? "Turn OFF" : "Keep turned OFF",
            onPress() {
              GlobalStore.actions.artsyPrefs.features.setLocalOverride({
                key: toggleKey,
                value: false,
              })
              devToggles[toggleKey].onChange?.(false, { toast })
            },
          },
        ])
      }}
      value={
        currentValue ? (
          <Text variant="sm-display" color="mono100" fontWeight="bold">
            {valText}
          </Text>
        ) : (
          <Text variant="sm-display" color="mono60">
            {valText}
          </Text>
        )
      }
    />
  )
}
