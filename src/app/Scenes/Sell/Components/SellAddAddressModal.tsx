import { BackButton, Flex, Input, Text, useSpace } from "@artsy/palette-mobile"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { AddressAutocomplete } from "app/Components/AddressAutocomplete/AddressAutocomplete"
import { ICON_HIT_SLOP } from "app/Components/constants"
import { SellFormLayout } from "app/Scenes/Sell/Components/SellFormLayout"
import { useCreateUserAddress } from "app/Scenes/Sell/hooks/useCreateUserAddress"
import { LocationWithDetails } from "app/utils/googleMaps"
import { useFormik } from "formik"
import { useState } from "react"
import { Modal, Platform } from "react-native"
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
  addressLine1: Yup.string().required("Choose a full street address."),
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
}) => (
  <Modal
    visible={visible}
    animationType="slide"
    presentationStyle="pageSheet"
    statusBarTranslucent
    onRequestClose={onDismiss}
  >
    {/* The street search opens a sheet, and the flow's sheet provider sits behind this modal */}
    <BottomSheetModalProvider>
      <SellAddAddressForm onDismiss={onDismiss} {...formProps} />
    </BottomSheetModalProvider>
  </Modal>
)

type SellAddAddressFormProps = Omit<SellAddAddressModalProps, "visible">

const SellAddAddressForm: React.FC<SellAddAddressFormProps> = ({ name, onDismiss, onSaved }) => {
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
    isValid,
    isSubmitting,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    setValues,
  } = useFormik<AddAddressFormValues>({
    initialValues,
    validationSchema,
    validateOnMount: true,
    onSubmit: async (address, { setStatus }) => {
      setStatus(null)

      try {
        const response = await submitMutation({
          variables: {
            input: {
              attributes: {
                name: address.name.trim(),
                addressLine1: address.addressLine1,
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
        setStatus((result?.__typename === "Errors" && result.errors[0]?.message) || SAVE_ERROR)
      } catch {
        setStatus(SAVE_ERROR)
      }
    },
  })

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
        <BackButton showX hitSlop={ICON_HIT_SLOP} onPress={onDismiss} />
      </Flex>

      <SellFormLayout
        buttonLabel="Save Address"
        buttonDisabled={!isValid || isSubmitting}
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
              value={values.place}
              onChange={(place) => {
                setValues(
                  {
                    ...values,
                    place,
                    addressLine1: place.street ?? "",
                    city: place.city ?? values.city,
                    region: place.stateCode ?? values.region,
                    postalCode: place.postalCode ?? values.postalCode,
                  },
                  true
                )
                setFieldTouched("addressLine1", true, false)
              }}
            />
            {!!errorFor("addressLine1") && (
              <Text variant="xs" color="red100" px={1}>
                {errorFor("addressLine1")}
              </Text>
            )}
          </Flex>

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
