import { Flex, Input, Text } from "@artsy/palette-mobile"
import { LocationAutocomplete } from "app/Components/LocationAutocomplete"
import { LocationWithDetails } from "app/utils/googleMaps"

const ZIP_LENGTH = 5

export interface SellLocation {
  address: LocationWithDetails | null
  zip: string
}

export const EMPTY_SELL_LOCATION: SellLocation = { address: null, zip: "" }

/** Complete once an address was picked from the suggestions and the zip has five digits */
export const isSellLocationComplete = ({ address, zip }: SellLocation) =>
  !!address?.id && zip.length === ZIP_LENGTH

interface SellLocationFieldsProps {
  value: SellLocation
  onChange: React.Dispatch<React.SetStateAction<SellLocation>>
}

export const SellLocationFields: React.FC<SellLocationFieldsProps> = ({ value, onChange }) => {
  return (
    <Flex gap={1}>
      <Text variant="sm">Where is the work located?</Text>
      <Text variant="xs" color="mono60">
        We use this to estimate shipping and arrange pickup.
      </Text>

      <LocationAutocomplete
        title="Street address"
        accessibilityLabel="Street address"
        searchOptions={{ types: "address", country: "us" }}
        // Typed text without a picked suggestion comes back without an id, so it stays incomplete
        allowCustomLocation
        onChange={(address) =>
          onChange((current) => ({
            address,
            zip: address.postalCode?.slice(0, ZIP_LENGTH) ?? current.zip,
          }))
        }
      />

      <Input
        title="Zip code"
        accessibilityLabel="Zip code"
        keyboardType="number-pad"
        autoComplete="postal-code"
        textContentType="postalCode"
        maxLength={ZIP_LENGTH}
        value={value.zip}
        onChangeText={(text) =>
          onChange((current) => ({ ...current, zip: text.replace(/\D/g, "") }))
        }
      />
    </Flex>
  )
}
