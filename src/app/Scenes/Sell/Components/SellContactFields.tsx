import { Flex, Input, Text } from "@artsy/palette-mobile"
import { SellLocationStore } from "app/Scenes/Sell/State/SellLocationStore"
import { useState } from "react"

export const SellContactFields: React.FC = () => {
  const phoneNumber = SellLocationStore.useStoreState((state) => state.phoneNumber)
  const setPhoneNumber = SellLocationStore.useStoreActions((actions) => actions.setPhoneNumber)
  const [touched, setTouched] = useState(false)

  return (
    <Flex gap={1}>
      <Text variant="md">Contact</Text>
      <Text variant="sm">What’s the best mobile number to reach you on?</Text>
      <Text variant="xs" color="mono60">
        A specialist will contact you directly to discuss next steps.
      </Text>
      <Input
        title="Mobile number"
        accessibilityLabel="Mobile number"
        keyboardType="phone-pad"
        autoComplete="tel"
        textContentType="telephoneNumber"
        required
        value={phoneNumber}
        error={touched && !phoneNumber.trim() ? "Phone number is required" : undefined}
        onChangeText={setPhoneNumber}
        onBlur={() => setTouched(true)}
      />
    </Flex>
  )
}
