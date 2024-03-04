import { Flex, Text, Switch } from "@artsy/palette-mobile"

export interface SavedSearchAlertSwitchProps {
  onChange: (value: boolean) => void
  active: boolean
  label: string
  description?: string
}

export const SavedSearchAlertSwitch = ({
  onChange,
  active,
  label,
}: SavedSearchAlertSwitchProps) => {
  return (
    <Flex flexDirection="row" alignItems="center">
      <Flex flex={1} mr={2}>
        <Text numberOfLines={1}>{label}</Text>
      </Flex>

      <Switch
        accessibilityRole="switch"
        accessibilityLabel={`${label} Toggler`}
        accessibilityState={{ selected: active }}
        onValueChange={onChange}
        value={active}
      />
    </Flex>
  )
}
