import { Box, Button, Flex, Input, Spacer, Text, useSpace } from "@artsy/palette-mobile"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { createToken } from "@stripe/stripe-react-native"
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
import { NavigationHeader } from "app/Components/NavigationHeader"
import { SelectRef } from "app/Components/Select"
import { BiddingNavigationStackParams } from "app/Navigation/AuthenticatedRoutes/BiddingNavigator"
import { KeyboardAwareForm } from "app/utils/keyboard/KeyboardAwareForm"
import { useFormik } from "formik"
import { memo, useCallback, useRef, useState } from "react"
import { LayoutChangeEvent } from "react-native"
import { KeyboardStickyView } from "react-native-keyboard-controller"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type CreditCardFormProps = NativeStackScreenProps<BiddingNavigationStackParams, "CreditCardForm">

const MemoizedInput = memo(Input)

export const CreditCardForm: React.FC<CreditCardFormProps> = ({
  navigation,
  route: {
    params: { onSubmit, billingAddress },
  },
}) => {
  const { bottom } = useSafeAreaInsets()
  const space = useSpace()
  const [bottomOffset, setBottomOffset] = useState(0)
  const initialValues: CreditCardFormValues = {
    ...CREDIT_CARD_INITIAL_FORM_VALUES,
    ...billingAddress,
  }

  const handleOnLayout = useCallback(
    (event: LayoutChangeEvent) => {
      setBottomOffset(event.nativeEvent.layout.height + bottom)
    },
    [setBottomOffset, bottom]
  )

  const handleFormSubmit = useCallback(
    async (values: CreditCardFormValues) => {
      try {
        const tokenBody = buildTokenParams(values)
        const token = await createToken(tokenBody)

        if (token.error) {
          throw new Error(`[Stripe]: error creating the token: ${JSON.stringify(token.error)}`)
        }

        onSubmit(token.token, buildBillingAddress(values))
        navigation.goBack()
      } catch (error) {
        setErrors({ creditCard: { valid: "There was an error. Please try again." } })
        console.error("CreditCardForm.tsx", error)
      }
    },
    [onSubmit, buildTokenParams, buildBillingAddress]
  )

  const {
    values,
    errors,
    touched,
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
    onSubmit: handleFormSubmit,
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

  const showError = (field: keyof CreditCardFormValues): string | undefined => {
    if (field === "creditCard") {
      return touched[field] ? errors.creditCard?.valid : undefined
    }

    if (field == "country") {
      return touched[field] ? errors[field]?.shortName : undefined
    }

    return touched[field] ? errors[field] : undefined
  }

  // Inputs refs
  const addressLine1Ref = useRef<Input>(null)
  const addressLine2Ref = useRef<Input>(null)
  const cityRef = useRef<Input>(null)
  const stateRef = useRef<Input>(null)
  const postalCodeRef = useRef<Input>(null)
  const phoneRef = useRef<Input>(null)
  const countryPickerRef = useRef<SelectRef>(null)

  return (
    <Flex flex={1}>
      <NavigationHeader onLeftButtonPress={() => navigation.goBack()}>
        Add Credit Card
      </NavigationHeader>

      <KeyboardAwareForm
        bottomOffset={bottomOffset}
        contentContainerStyle={{ padding: space(2), paddingBottom: space(4) }}
      >
        <Flex>
          <>
            <CreditCardField onCardChange={handleOnCardChange} />

            {!!errors.creditCard?.valid && (
              <Text testID="credit-card-error-message" variant="xs" mt={2} color="red100">
                {errors.creditCard.valid}
              </Text>
            )}
          </>

          <MemoizedInput
            testID="input-full-name"
            title="Name on card"
            placeholder="Full name"
            defaultValue={values.fullName}
            error={showError("fullName")}
            onChangeText={handleChange("fullName")}
            onBlur={handleBlur("fullName")}
            returnKeyType="next"
            onSubmitEditing={() => addressLine1Ref.current?.focus()}
            submitBehavior="submit"
          />
          <MemoizedInput
            testID="input-address-1"
            ref={addressLine1Ref}
            title="Address line 1"
            defaultValue={values.addressLine1}
            error={showError("addressLine1")}
            placeholder="Add street address"
            onChangeText={handleChange("addressLine1")}
            onBlur={handleBlur("addressLine1")}
            returnKeyType="next"
            onSubmitEditing={() => addressLine2Ref.current?.focus()}
            submitBehavior="submit"
          />
          <MemoizedInput
            testID="input-address-2"
            ref={addressLine2Ref}
            title="Address line 2"
            defaultValue={values.addressLine2}
            error={showError("addressLine2")}
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
            submitBehavior="submit"
          />
          <MemoizedInput
            testID="input-city"
            ref={cityRef}
            title="City"
            defaultValue={values.city}
            error={showError("city")}
            onChangeText={handleChange("city")}
            onBlur={handleBlur("city")}
            returnKeyType="next"
            onSubmitEditing={() => stateRef.current?.focus()}
            submitBehavior="submit"
          />
          <MemoizedInput
            testID="input-state"
            ref={stateRef}
            title="State, province, or region"
            defaultValue={values.state}
            error={showError("state")}
            onChangeText={handleChange("state")}
            onBlur={handleBlur("state")}
            returnKeyType="next"
            onSubmitEditing={() => postalCodeRef.current?.focus()}
            submitBehavior="submit"
          />
          <MemoizedInput
            testID="input-postal-code"
            ref={postalCodeRef}
            title="Postal Code"
            defaultValue={values.postalCode}
            error={showError("postalCode")}
            onChangeText={handleChange("postalCode")}
            onBlur={handleBlur("postalCode")}
            returnKeyType="next"
            onSubmitEditing={() => phoneRef.current?.focus()}
            submitBehavior="submit"
          />
          <MemoizedInput
            testID="input-phone"
            ref={phoneRef}
            title="Phone"
            placeholder="Add phone number"
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            defaultValue={values.phoneNumber}
            error={showError("phoneNumber")}
            onChangeText={handleChange("phoneNumber")}
            onBlur={handleBlur("phoneNumber")}
            returnKeyType="next"
            onSubmitEditing={() => countryPickerRef.current?.openSelectModal()}
            submitBehavior="submit"
          />

          <Spacer y={2} />

          <CountrySelect
            ref={countryPickerRef}
            onSelectValue={(countryCode: string) =>
              setFieldValue("country", {
                shortName: countryCode,
                longName: findCountryNameByCountryCode(countryCode) || "",
              })
            }
            value={values.country.shortName}
            hasError={!!showError("country")}
          />
          {!!showError("country") && (
            <Text variant="xs" mt={1} color="red100">
              {showError("country")}
            </Text>
          )}
        </Flex>

        <Spacer y={2} />

        <Text variant="sm" color="mono60">
          Registration is free.
          {"\n"}
          {"\n"}A valid credit card is required in order to bid. Please enter your credit card
          information below. The name on your Artsy account must match the name on the card.
        </Text>

        <Spacer y={1} />
      </KeyboardAwareForm>

      <KeyboardStickyView onLayout={handleOnLayout} offset={{ opened: bottom }}>
        <Box p={2} backgroundColor="mono0">
          <Button
            testID="credit-card-form-button"
            disabled={!isValid || !dirty}
            loading={isSubmitting}
            block
            width={100}
            onPress={() => handleSubmit()}
          >
            Save
          </Button>
        </Box>
      </KeyboardStickyView>
    </Flex>
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
