import { Flex, Switch, Text } from "@artsy/palette-mobile"
import { useToast } from "app/Components/Toast/toastHook"
import { GlobalStore } from "app/store/GlobalStore"
import { DevToggleName, devToggles } from "app/store/config/features"

export const DevToggleItem: React.FC<{ toggleKey: DevToggleName }> = ({ toggleKey }) => {
  const config = GlobalStore.useAppState((s) => s.artsyPrefs)
  const currentValue = config.features.devToggles[toggleKey]
  const description = devToggles[toggleKey].description
  const toast = useToast()

  return (
    <Flex flexDirection="row" alignItems="center" justifyContent="space-between" py="7.5px" px={2}>
      <Flex flex={1} mr={2}>
        <Text variant="sm-display" color="mono100">
          {description}
        </Text>
      </Flex>

      <Switch
        value={currentValue}
        onValueChange={(value) => {
          GlobalStore.actions.artsyPrefs.features.setLocalOverride({
            key: toggleKey,
            value,
          })
          devToggles[toggleKey].onChange?.(value, { toast })
        }}
      />
    </Flex>
  )
}
