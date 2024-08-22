import {
  ArtsyKeyboardAvoidingView,
  Box,
  Button,
  Flex,
  Input,
  Spacer,
  Text,
  useSpace,
} from "@artsy/palette-mobile"
import { createToken, Token } from "@stripe/stripe-react-native"
import { CreateCardTokenParams } from "@stripe/stripe-react-native/lib/typescript/src/types/Token"
import { Details } from "@stripe/stripe-react-native/lib/typescript/src/types/components/CardFieldInput"
import {
  CREDIT_CARD_INITIAL_FORM_VALUES,
  CreditCardFormValues,
} from "app/Components/Bidding/Utils/creditCardFormFields"
import { findCountryNameByCountryCode } from "app/Components/Bidding/Utils/findCountryNameByCountryCode"
import { creditCardFormValidationSchema } from "app/Components/Bidding/Validators/creditCardFormFieldsValidationSchema"
import { Address } from "app/Components/Bidding/types"
import { CountrySelect } from "app/Components/CountrySelect"
import { CreditCardField } from "app/Components/CreditCardField/CreditCardField"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { Select } from "app/Components/Select/SelectV2"
import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import { useFormik } from "formik"
import { useRef } from "react"
import { ScrollView } from "react-native"

interface CreditCardFormProps {
  navigator: NavigatorIOS
  billingAddress?: Address | null
  onSubmit: (t: Token.Result, a: Address) => void
}

export const CreditCardForm: React.FC<CreditCardFormProps> = ({
  onSubmit,
  billingAddress,
  navigator,
}) => {
  const space = useSpace()
  const initialValues: CreditCardFormValues = {
    ...CREDIT_CARD_INITIAL_FORM_VALUES,
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
    validationSchema: creditCardFormValidationSchema,
    validateOnChange: false,
    validateOnBlur: false,
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

  const handleOnCardChange = (cardDetails: Details) => {
    setFieldValue("creditCard", {
      valid: cardDetails.complete,
      params: {
        expiryMonth: cardDetails.expiryMonth,
        expiryYear: cardDetails.expiryYear,
        last4: cardDetails.last4,
      },
    })
  }

  // Inputs refs
  const addressLine1Ref = useRef<Input>(null)
  const addressLine2Ref = useRef<Input>(null)
  const cityRef = useRef<Input>(null)
  const stateRef = useRef<Input>(null)
  const postalCodeRef = useRef<Input>(null)
  const phoneRef = useRef<Input>(null)
  const countryRef = useRef<Select<any>>(null)

  return (
    <ArtsyKeyboardAvoidingView>
      <FancyModalHeader onLeftButtonPress={() => navigator.pop()}>Add Credit Card</FancyModalHeader>

      <ScrollView
        contentContainerStyle={{ padding: space(2), paddingBottom: space(4) }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <Flex gap={1}>
          <>
            <CreditCardField onCardChange={handleOnCardChange} />

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

          <Spacer y={2} />

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
        </Flex>

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
