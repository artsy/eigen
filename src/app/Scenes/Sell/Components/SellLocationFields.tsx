import { Flex, Input, Text } from "@artsy/palette-mobile"
import { AddressAutocomplete } from "app/Components/AddressAutocomplete/AddressAutocomplete"
import { SellLocationStore, US_ZIP_LENGTH } from "app/Scenes/Sell/State/SellLocationStore"

export const SellLocationFields: React.FC = () => {
  const { address, postalCode } = SellLocationStore.useStoreState((state) => state)
  const { setAddress, setPostalCode } = SellLocationStore.useStoreActions((actions) => actions)

  return (
    <Flex gap={1}>
      <Text variant="sm">Where is the work located?</Text>
      <Text variant="xs" color="mono60">
        We use this to estimate shipping and arrange pickup.
      </Text>

      <AddressAutocomplete
        title="Street address"
        testID="sell-street-address"
        country="us"
        value={address}
        onChange={setAddress}
      />

      <Input
        title="Zip code"
        accessibilityLabel="Zip code"
        keyboardType="number-pad"
        autoComplete="postal-code"
        textContentType="postalCode"
        maxLength={US_ZIP_LENGTH}
        value={postalCode}
        onChangeText={(text) => setPostalCode(text.replace(/\D/g, ""))}
      />
    </Flex>
  )
}
