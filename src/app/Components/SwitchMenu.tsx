import { Flex, Switch, Text } from "@artsy/palette-mobile"

interface SwitchMenuProps {
  onChange: (value: boolean) => void
  value: boolean
  title: string
  description: string
  disabled?: boolean
  testID?: string
}

export const SwitchMenu = ({
  onChange,
  value,
  title,
  description,
  disabled = false,
  testID,
}: SwitchMenuProps) => {
  return (
    <Flex flexDirection="row" alignItems="flex-start" flexShrink={0} my={1}>
      <Flex style={{ width: "80%", justifyContent: "center" }}>
        <Text variant="sm-display" color={disabled ? "mono60" : "mono100"}>
          {title}
        </Text>
        <Text variant="sm" color={disabled ? "mono30" : "mono60"} py={0.5}>
          {description}
        </Text>
      </Flex>

      <Flex style={{ width: "20%" }} alignItems="flex-end">
        <Switch testID={testID} onValueChange={onChange} value={value} disabled={disabled} />
      </Flex>
    </Flex>
  )
}
