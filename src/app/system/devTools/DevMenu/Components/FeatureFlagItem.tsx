import { Flex, Switch, Text } from "@artsy/palette-mobile"
import { GlobalStore } from "app/store/GlobalStore"
import { FeatureName, features } from "app/store/config/features"

export const FeatureFlagItem: React.FC<{ flagKey: FeatureName }> = ({ flagKey }) => {
  const config = GlobalStore.useAppState((s) => s.artsyPrefs)
  const currentValue = config.features.flags[flagKey]
  const defaultValue = config.features.defaultFlags[flagKey]
  const isLocalOverrideInEffect = flagKey in config.features.localOverrides
  const isOverriddenFromDefault = isLocalOverrideInEffect && currentValue !== defaultValue
  const description = features[flagKey].description ?? flagKey

  return (
    <Flex flexDirection="row" alignItems="center" justifyContent="space-between" py="7.5px" px={2}>
      <Flex flex={1} mr={2}>
        <Text
          variant="sm-display"
          color={isOverriddenFromDefault ? "blue100" : "mono100"}
          fontWeight={isOverriddenFromDefault ? "bold" : "normal"}
        >
          {description}
        </Text>

        <Text variant="xs" color="mono60" mt="2px">
          Default: {defaultValue ? "On" : "Off"}
        </Text>
      </Flex>

      <Switch
        value={currentValue}
        onValueChange={(value) => {
          GlobalStore.actions.artsyPrefs.features.setLocalOverride({
            key: flagKey,
            value,
          })
        }}
      />
    </Flex>
  )
}
