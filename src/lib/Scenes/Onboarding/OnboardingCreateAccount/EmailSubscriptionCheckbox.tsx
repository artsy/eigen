import { Checkbox } from "palette/elements/Checkbox"
import { Flex, Text, Touchable } from "palette"
import React from "react"

interface EmailSubscriptionCheckboxProps {
  checked: boolean
  setChecked: (checked: boolean) => void
  error?: boolean
}

export const EmailSubscriptionCheckbox: React.FC<EmailSubscriptionCheckboxProps> = ({ setChecked, checked, error }) => {
  return (
    <Touchable haptic onPress={() => setChecked(!checked)}>
      <Flex my={2} flexDirection="row" alignItems="flex-start">
        <Checkbox error={error} checked={checked} onPress={() => setChecked(!checked)} mt={0.3} />
        <Text variant="small">
          Dive deeper into the art market with Artsy emails. Subscribe to hear about our products, services, editorials,
          and other promotional content. Unsubscribe at any time.
        </Text>
      </Flex>
    </Touchable>
  )
}
