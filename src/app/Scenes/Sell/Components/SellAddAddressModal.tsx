import { BackButton, Flex, Input, Text, useSpace } from "@artsy/palette-mobile"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { AddressAutocomplete } from "app/Components/AddressAutocomplete/AddressAutocomplete"
import { ICON_HIT_SLOP } from "app/Components/constants"
import { SellFormLayout } from "app/Scenes/Sell/Components/SellFormLayout"
import { useCreateUserAddress } from "app/Scenes/Sell/hooks/useCreateUserAddress"
import { LocationWithDetails } from "app/utils/googleMaps"
import { useFormik } from "formik"
import { useState } from "react"
import { AccessibilityInfo, Modal, Platform } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import * as Yup from "yup"

// Same as Force: five digits, with an optional ZIP+4 suffix
const US_POSTAL_CODE_REGEXP = /^\d{5}(?:-\d{4})?$/
const US_POSTAL_CODE_MAX_LENGTH = 10
const SAVE_ERROR = "We couldn’t save this address."

interface AddAddressFormValues {
  name: string
  /** The Google place picked for the street, which fills the fields below it */
  place: LocationWithDetails | null
  addressLine1: string
  addressLine2: string
  city: string
  region: string
  postalCode: string
}

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Enter your full name."),
  addressLine1: Yup.string()
    .trim()
    .required("Enter a street address.")
    .matches(/^\d/, "Enter a street number."),
  city: Yup.string().trim().required("Enter a city."),
  region: Yup.string().trim().required("Enter a state."),
  postalCode: Yup.string()
    .required("ZIP code is required")
    .matches(US_POSTAL_CODE_REGEXP, "Invalid postal code"),
})

interface SellAddAddressModalProps {
  visible: boolean
  name: string | null | undefined
  onDismiss: () => void
  onSaved: (addressID: string) => void
}

export const SellAddAddressModal: React.FC<SellAddAddressModalProps> = ({
  visible,
  onDismiss,
  ...formProps
}) => {
  const [searchOpen, setSearchOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  // Android Back reaches the modal, not the search sheet, so close the sheet first
  const requestClose = () => {
    if (saving) {
      return
    }
    if (searchOpen) {
      setSearchOpen(false)
      return
    }
    onDismiss()
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      statusBarTranslucent
      onRequestClose={requestClose}
    >
      {/* A modal is its own native window, so the sheet needs its own gesture root and provider */}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <SellAddAddressForm
            {...formProps}
            searchOpen={searchOpen}
            onSearchOpenChange={setSearchOpen}
            onSavingChange={setSaving}
            onClose={requestClose}
            onDismiss={onDismiss}
          />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </Modal>
  )
}

interface SellAddAddressFormProps extends Omit<SellAddAddressModalProps, "visible"> {
  searchOpen: boolean
  onSearchOpenChange: (open: boolean) => void
  onSavingChange: (saving: boolean) => void
  /** Closes the form unless it's saving */
  onClose: () => void
}

const SellAddAddressForm: React.FC<SellAddAddressFormProps> = ({
  name,
  searchOpen,
  onSearchOpenChange,
  onSavingChange,
  onClose,
  onDismiss,
  onSaved,
}) => {
  const space = useSpace()
  const { top } = useSafeAreaInsets()
  const { submitMutation } = useCreateUserAddress()

  // Formik validates again whenever initialValues change, so a refetched name would loop it
  const [initialValues] = useState<AddAddressFormValues>(() => ({
    name: name ?? "",
    place: null,
    addressLine1: "",
    addressLine2: "",
    city: "",
    region: "",
    postalCode: "",
  }))

  const {
    values,
    errors,
    touched,
    status,
    isSubmitting,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    setValues,
  } = useFormik<AddAddressFormValues>({
    initialValues,
    validationSchema,
    onSubmit: async (address, { setStatus }) => {
      const fail = (message: string) => {
        setStatus(message)
        AccessibilityInfo.announceForAccessibility(message)
      }

      setStatus(null)
      onSavingChange(true)

      try {
        const response = await submitMutation({
          variables: {
            input: {
              attributes: {
                name: address.name.trim(),
                addressLine1: address.addressLine1.trim(),
                addressLine2: address.addressLine2.trim() || null,
                city: address.city.trim(),
                region: address.region.trim(),
                postalCode: address.postalCode,
                country: "US",
              },
            },
          },
        })
        const result = response.createUserAddress?.userAddressOrErrors

        if (result?.__typename === "UserAddress") {
          onSaved(result.internalID)
          onDismiss()
          return
        }
        fail((result?.__typename === "Errors" && result.errors[0]?.message) || SAVE_ERROR)
      } catch {
        fail(SAVE_ERROR)
      } finally {
        onSavingChange(false)
      }
    },
  })

  // Checked on every render: Formik's validateOnMount doesn't run on device, so isValid starts true
  const canSave = validationSchema.isValidSync(values)

  const errorFor = (field: keyof AddAddressFormValues) =>
    touched[field] ? (errors[field] as string | undefined) : undefined

  const handleChangeText = (field: keyof AddAddressFormValues) => (text: string) =>
    setFieldValue(field, text)

  return (
    <Flex flex={1} bg="mono0">
      <Flex
        bg="mono0"
        px={2}
        pb={2}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        // Android has no page sheet, so the modal fills the screen under the status bar
        style={{ paddingTop: space(2) + (Platform.OS === "android" ? top : 0) }}
      >
        <Text variant="lg-display">Add address</Text>
        <BackButton showX hitSlop={ICON_HIT_SLOP} onPress={onClose} />
      </Flex>

      <SellFormLayout
        buttonLabel="Save Address"
        buttonDisabled={!canSave || isSubmitting}
        buttonLoading={isSubmitting}
        onButtonPress={() => handleSubmit()}
      >
        <Flex px={2} gap={1}>
          <Input
            title="Full name"
            accessibilityLabel="Full name"
            autoComplete="name"
            textContentType="name"
            required
            value={values.name}
            error={errorFor("name")}
            onChangeText={handleChangeText("name")}
            onBlur={handleBlur("name")}
          />

          <Input
            title="Country"
            accessibilityLabel="Country"
            value="United States"
            disabled
            required
          />

          <Flex gap={0.5}>
            <AddressAutocomplete
              title="Street address"
              testID="sell-street-address"
              country="us"
              required
              value={values.place}
              searchVisible={searchOpen}
              onSearchVisibleChange={onSearchOpenChange}
              onChange={(place) => {
                // Clear what the new place lacks, so nothing from the last place is left behind
                setValues(
                  {
                    ...values,
                    place,
                    addressLine1: place.street ?? "",
                    city: place.city ?? "",
                    region: place.stateCode ?? "",
                    postalCode: place.postalCode ?? "",
                  },
                  true
                )
                setFieldTouched("addressLine1", true, false)
              }}
            />
            {!values.place && !!errorFor("addressLine1") && (
              <Text variant="xs" color="red100" px={1}>
                {errorFor("addressLine1")}
              </Text>
            )}
          </Flex>

          {/* Google can leave out the street number, or the whole street, so let users fix it */}
          {!!values.place && (
            <Input
              title="Address line 1"
              accessibilityLabel="Address line 1"
              autoComplete="address-line1"
              textContentType="streetAddressLine1"
              required
              value={values.addressLine1}
              error={errorFor("addressLine1")}
              onChangeText={handleChangeText("addressLine1")}
              onBlur={handleBlur("addressLine1")}
            />
          )}

          <Input
            title="Apt, floor, suite, etc. (optional)"
            accessibilityLabel="Apt, floor, suite, etc."
            autoComplete="address-line2"
            value={values.addressLine2}
            onChangeText={handleChangeText("addressLine2")}
          />

          <Input
            title="City"
            accessibilityLabel="City"
            autoComplete="postal-address-locality"
            textContentType="addressCity"
            required
            value={values.city}
            error={errorFor("city")}
            onChangeText={handleChangeText("city")}
            onBlur={handleBlur("city")}
          />

          <Input
            title="State, region or province"
            accessibilityLabel="State, region or province"
            autoComplete="postal-address-region"
            textContentType="addressState"
            required
            value={values.region}
            error={errorFor("region")}
            onChangeText={handleChangeText("region")}
            onBlur={handleBlur("region")}
          />

          <Input
            title="ZIP/Postal code"
            accessibilityLabel="ZIP/Postal code"
            keyboardType="numbers-and-punctuation"
            autoComplete="postal-code"
            textContentType="postalCode"
            maxLength={US_POSTAL_CODE_MAX_LENGTH}
            required
            value={values.postalCode}
            error={errorFor("postalCode")}
            onChangeText={(text) => setFieldValue("postalCode", text.replace(/[^\d-]/g, ""))}
            onBlur={handleBlur("postalCode")}
          />

          {!!status && (
            <Text variant="xs" color="red100">
              {status}
            </Text>
          )}
        </Flex>
      </SellFormLayout>
    </Flex>
  )
}
