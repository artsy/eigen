import { Button, Flex, Text } from "@artsy/palette-mobile"
import { AddressAutocomplete } from "app/Components/AddressAutocomplete/AddressAutocomplete"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { useCreateUserAddress } from "app/Scenes/Sell/hooks/useCreateUserAddress"
import { LocationWithDetails } from "app/utils/googleMaps"
import BottomSheetKeyboardAwareScrollView from "app/utils/keyboard/BottomSheetKeyboardAwareScrollView"
import { useState } from "react"
import { KeyboardController } from "react-native-keyboard-controller"

const US_ZIP_LENGTH = 5

interface SellAddAddressSheetProps {
  visible: boolean
  name: string | null | undefined
  onDismiss: () => void
  onSaved: (addressID: string) => void
}

export const SellAddAddressSheet: React.FC<SellAddAddressSheetProps> = ({
  visible,
  name,
  onDismiss,
  onSaved,
}) => {
  // Android keeps the keyboard open after the sheet's input goes away
  const close = () => {
    KeyboardController.dismiss()
    onDismiss()
  }

  return (
    <AutomountedBottomSheetModal
      sentryName="SellAddAddressSheet"
      visible={visible}
      enableDynamicSizing
      onDismiss={close}
    >
      <BottomSheetKeyboardAwareScrollView keyboardShouldPersistTaps="always">
        <SellAddAddressForm
          name={name}
          onSaved={(addressID) => {
            onSaved(addressID)
            close()
          }}
        />
      </BottomSheetKeyboardAwareScrollView>
    </AutomountedBottomSheetModal>
  )
}

interface SellAddAddressFormProps {
  name: string | null | undefined
  onSaved: (addressID: string) => void
}

const SellAddAddressForm: React.FC<SellAddAddressFormProps> = ({ name, onSaved }) => {
  const [place, setPlace] = useState<LocationWithDetails | null>(null)
  const [postalCode, setPostalCode] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { submitMutation } = useCreateUserAddress()

  const handleSave = async () => {
    if (!place?.street || !place.city) {
      setError("Choose a full street address.")
      return
    }

    setSaving(true)
    setError(null)

    try {
      const response = await submitMutation({
        variables: {
          input: {
            attributes: {
              name: name ?? "",
              addressLine1: place.street,
              city: place.city,
              region: place.stateCode,
              postalCode,
              country: place.countryCode ?? "US",
            },
          },
        },
      })
      const result = response.createUserAddress?.userAddressOrErrors

      if (result?.__typename === "UserAddress") {
        onSaved(result.internalID)
        return
      }
      setError(
        (result?.__typename === "Errors" && result.errors[0]?.message) ||
          "We couldn’t save this address."
      )
    } catch {
      setError("We couldn’t save this address.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Flex px={2} pt={1} pb={4} gap={2}>
      <Text variant="sm-display">Add new address</Text>

      <AddressAutocomplete
        title="Street address"
        testID="sell-street-address"
        country="us"
        value={place}
        onChange={(address) => {
          setPlace(address)
          if (address.postalCode) {
            setPostalCode(address.postalCode.slice(0, US_ZIP_LENGTH))
          }
          setError(null)
        }}
      />

      <BottomSheetInput
        title="Zip code"
        accessibilityLabel="Zip code"
        keyboardType="number-pad"
        autoComplete="postal-code"
        textContentType="postalCode"
        maxLength={US_ZIP_LENGTH}
        value={postalCode}
        onChangeText={(text) => setPostalCode(text.replace(/\D/g, ""))}
      />

      {!!error && (
        <Text variant="xs" color="red100">
          {error}
        </Text>
      )}

      <Button
        block
        loading={saving}
        disabled={!place || postalCode.length !== US_ZIP_LENGTH}
        onPress={handleSave}
      >
        Save Address
      </Button>
    </Flex>
  )
}
