import { ArtsyKeyboardAvoidingView, Box, Button, Input, Spacer, Text } from "@artsy/palette-mobile"
import { createToken, Token } from "@stripe/stripe-react-native"
import { CreateCardTokenParams } from "@stripe/stripe-react-native/lib/typescript/src/types/Token"
import { findCountryNameByCountryCode } from "app/Components/Bidding/Utils/findCountryNameByCountryCode"
import { Address, Country, PaymentCardTextFieldParams } from "app/Components/Bidding/types"
import { CountrySelect } from "app/Components/CountrySelect"
import { CreditCardField } from "app/Components/CreditCardField/CreditCardField"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { Select } from "app/Components/Select/SelectV2"
import { Stack } from "app/Components/Stack"
import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import { useFormik } from "formik"
import { useRef } from "react"
import { ScrollView } from "react-native"
import * as Yup from "yup"

interface CreditCardFormProps {
  navigator: NavigatorIOS
  billingAddress?: Address | null
  onSubmit: (t: Token.Result, a: Address) => void
}

interface CreditCardFormValues {
  creditCard: {
    valid: boolean
    params: Partial<PaymentCardTextFieldParams>
  }
  fullName: string
  addressLine1: string
  addressLine2: string
  city: string
  postalCode: string
  state: string
  country: Country
  phoneNumber: string
}
const INITIAL_FORM_VALUES: CreditCardFormValues = {
  creditCard: {
    valid: false,
    params: {
      expiryMonth: undefined,
      expiryYear: undefined,
      last4: undefined,
    },
  },
  fullName: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  postalCode: "",
  state: "",
  country: { longName: "", shortName: "" },
  phoneNumber: "",
}

const validationSchema = Yup.object().shape({
  creditCard: Yup.object().shape({
    valid: Yup.boolean().required("Credit card is required"),
  }),
  fullName: Yup.string().required("Name is required"),
  addressLine1: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  postalCode: Yup.string().required("Postal code is required"),
  state: Yup.string().required("State is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  country: Yup.object().shape({
    shortName: Yup.string().required("Country is required"),
  }),
})

export const CreditCardForm: React.FC<CreditCardFormProps> = ({
  onSubmit,
  billingAddress,
  navigator,
}) => {
  const initialValues: CreditCardFormValues = {
    ...INITIAL_FORM_VALUES,
    ...billingAddress,
  }

  const {
    values,
    errors,
    isSubmitting,
    isValid,
    dirty,
    handleSubmit,
    handleBlur,
    handleChange,
    setFieldValue,
    setErrors,
  } = useFormik({
    initialValues,
    validationSchema,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        const tokenBody = buildTokenParams(values)
        const token = await createToken(tokenBody)

        if (token.error) {
          throw new Error(`[Stripe]: error creating the token: ${JSON.stringify(token.error)}`)
        }

        onSubmit(token.token, buildBillingAddress(values))
        navigator.pop()
      } catch (error) {
        setErrors({ creditCard: { valid: "There was an error. Please try again." } })
        console.error("CreditCardForm.tsx", error)
      }
    },
  })

  const addressLine1Ref = useRef<Input>(null)
  const addressLine2Ref = useRef<Input>(null)
  const cityRef = useRef<Input>(null)
  const stateRef = useRef<Input>(null)
  const postalCodeRef = useRef<Input>(null)
  const phoneRef = useRef<Input>(null)
  const countryRef = useRef<Select<any>>(null)

  const buildTokenParams = (values: CreditCardFormValues): CreateCardTokenParams => {
    return {
      type: "Card",
      name: values.fullName ?? undefined,
      address: {
        line1: values.addressLine1 ?? undefined,
        line2: values.addressLine2 ?? undefined,
        city: values.city ?? undefined,
        state: values.state ?? undefined,
        country: values.country?.shortName ?? undefined,
        postalCode: values.postalCode ?? undefined,
      },
    }
  }

  const buildBillingAddress = (values: CreditCardFormValues): Address => {
    return {
      fullName: values.fullName ?? "",
      addressLine1: values.addressLine1 ?? "",
      addressLine2: values.addressLine2 ?? "",
      city: values.city ?? "",
      state: values.state ?? "",
      country: values.country ?? { longName: "", shortName: "" },
      postalCode: values.postalCode ?? "",
      phoneNumber: values.phoneNumber ?? "",
    }
  }

  return (
    <ArtsyKeyboardAvoidingView>
      <FancyModalHeader onLeftButtonPress={() => navigator.pop()}>Add Credit Card</FancyModalHeader>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 50 }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <Stack spacing={1}>
          <>
            <CreditCardField
              onCardChange={(cardDetails) => {
                setFieldValue("creditCard", {
                  valid: cardDetails.complete,
                  params: {
                    expiryMonth: cardDetails.expiryMonth,
                    expiryYear: cardDetails.expiryYear,
                    last4: cardDetails.last4,
                  },
                })
              }}
            />

            {!!errors.creditCard?.valid && (
              <Text testID="credit-card-error-message" variant="xs" mt={2} color="red100">
                {errors.creditCard.valid}
              </Text>
            )}
          </>

          <Input
            testID="input-full-name"
            title="Name on card"
            placeholder="Full name"
            value={values.fullName}
            error={errors.fullName}
            onChangeText={handleChange("fullName")}
            onBlur={handleBlur("fullName")}
            returnKeyType="next"
            onSubmitEditing={() => addressLine1Ref.current?.focus()}
          />
          <Input
            testID="input-address-1"
            ref={addressLine1Ref}
            title="Address line 1"
            value={values.addressLine1}
            error={errors.addressLine1}
            placeholder="Add street address"
            onChangeText={handleChange("addressLine1")}
            onBlur={handleBlur("addressLine1")}
            returnKeyType="next"
            onSubmitEditing={() => addressLine2Ref.current?.focus()}
          />
          <Input
            testID="input-address-2"
            ref={addressLine2Ref}
            title="Address line 2"
            value={values.addressLine2}
            error={errors.addressLine2}
            optional
            placeholder={[
              "Add your apt, floor, suite, etc.",
              "Add your apt, floor, etc.",
              "Add your apt, etc.",
            ]}
            onChangeText={handleChange("addressLine2")}
            onBlur={handleBlur("addressLine2")}
            returnKeyType="next"
            onSubmitEditing={() => cityRef.current?.focus()}
          />
          <Input
            testID="input-city"
            ref={cityRef}
            title="City"
            value={values.city}
            error={errors.city}
            onChangeText={handleChange("city")}
            onBlur={handleBlur("city")}
            returnKeyType="next"
            onSubmitEditing={() => stateRef.current?.focus()}
          />
          <Input
            testID="input-state"
            ref={stateRef}
            title="State, province, or region"
            value={values.state}
            error={errors.state}
            onChangeText={handleChange("state")}
            onBlur={handleBlur("state")}
            returnKeyType="next"
            onSubmitEditing={() => postalCodeRef.current?.focus()}
          />
          <Input
            testID="input-postal-code"
            ref={postalCodeRef}
            title="Postal Code"
            value={values.postalCode}
            error={errors.postalCode}
            onChangeText={handleChange("postalCode")}
            onBlur={handleBlur("postalCode")}
            returnKeyType="next"
            onSubmitEditing={() => phoneRef.current?.focus()}
          />
          <Input
            testID="input-phone"
            ref={phoneRef}
            title="Phone"
            placeholder="Add phone number"
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            value={values.phoneNumber}
            error={errors.phoneNumber}
            onChangeText={handleChange("phoneNumber")}
            onBlur={handleBlur("phoneNumber")}
            onSubmitEditing={() => phoneRef.current?.blur()}
          />

          <Spacer y={1} />

          <CountrySelect
            ref={countryRef}
            onSelectValue={(countryCode: string) =>
              setFieldValue("country", {
                shortName: countryCode,
                longName: findCountryNameByCountryCode(countryCode) || "",
              })
            }
            value={values.country.shortName}
          />
        </Stack>

        <Spacer y={2} />

        <Text variant="sm" color="black60">
          Registration is free.
          {"\n"}
          {"\n"}A valid credit card is required in order to bid. Please enter your credit card
          information below. The name on your Artsy account must match the name on the card.
        </Text>
      </ScrollView>

      <Spacer y={1} />

      <Box p={2} mb={2}>
        <Button
          testID="credit-card-form-button"
          disabled={!isValid || !dirty}
          loading={isSubmitting}
          block
          width={100}
          onPress={handleSubmit}
        >
          Save
        </Button>
      </Box>
    </ArtsyKeyboardAvoidingView>
  )
}
