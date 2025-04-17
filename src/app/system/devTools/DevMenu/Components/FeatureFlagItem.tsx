import { Text } from "@artsy/palette-mobile"
import { GlobalStore } from "app/store/GlobalStore"
import { FeatureName, features } from "app/store/config/features"
import { DevMenuButtonItem } from "app/system/devTools/DevMenu/Components/DevMenuButtonItem"
import { Alert } from "react-native"

export const FeatureFlagItem: React.FC<{ flagKey: FeatureName }> = ({ flagKey }) => {
  const config = GlobalStore.useAppState((s) => s.artsyPrefs)
  const currentValue = config.features.flags[flagKey]
  const isLocalOverrideInEffect = flagKey in config.features.localOverrides
  const valText = currentValue ? "Yes" : "No"
  const description = features[flagKey].description ?? flagKey

  return (
    <DevMenuButtonItem
      title={description}
      onPress={() => {
        Alert.alert(description as string, undefined, [
          {
            text: "Override with 'Yes'",
            onPress() {
              GlobalStore.actions.artsyPrefs.features.setLocalOverride({
                key: flagKey,
                value: true,
              })
            },
          },
          {
            text: "Override with 'No'",
            onPress() {
              GlobalStore.actions.artsyPrefs.features.setLocalOverride({
                key: flagKey,
                value: false,
              })
            },
          },
          {
            text: isLocalOverrideInEffect ? "Revert to default value" : "Keep default value",
            onPress() {
              GlobalStore.actions.artsyPrefs.features.setLocalOverride({
                key: flagKey,
                value: null,
              })
            },
            style: "destructive",
          },
        ])
      }}
      value={
        isLocalOverrideInEffect ? (
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
