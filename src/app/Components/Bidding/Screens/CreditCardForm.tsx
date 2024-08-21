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
import { FormField as Field, FormFields } from "app/Scenes/MyProfile/MyProfilePaymentNewCreditCard"
import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import { action, computed, Computed, useLocalStore } from "easy-peasy"
import { useRef } from "react"
import { ScrollView } from "react-native"

interface CreditCardFormProps {
  navigator: NavigatorIOS
  billingAddress?: Address | null
  onSubmit: (t: Token.Result, a: Address) => void
}

interface CreditCardFormFields extends Omit<FormFields, "creditCard" | "country"> {
  creditCard: Field<{
    valid: boolean
    params: Partial<PaymentCardTextFieldParams>
  }>
  country: Field<Country>
  phoneNumber: Field
}

interface CreditCardStore {
  fields: CreditCardFormFields
  allPresent: Computed<CreditCardStore, boolean>
  loading: Pick<Field<boolean>, "value" | "setValue">
  error: Pick<Field<boolean>, "value" | "setValue">
}

const initialFieldState: (value?: any) => Field<any> = (value) => ({
  value: value ?? null,
  touched: false,
  required: true,
  isPresent: computed((self) => {
    if (!self.required) {
      return true
    } else {
      return self.value !== null && (typeof self.value !== "string" || !!self.value)
    }
  }),
  setValue: action((state, payload) => {
    state.value = payload
  }),
})

export const CreditCardForm: React.FC<CreditCardFormProps> = ({
  onSubmit,
  billingAddress,
  navigator,
}) => {
  console.log({ billingAddressfromform: billingAddress })
  const [state, actions] = useLocalStore<CreditCardStore>(() => ({
    fields: {
      creditCard: initialFieldState(),
      fullName: initialFieldState(billingAddress?.fullName),
      addressLine1: initialFieldState(billingAddress?.addressLine1),
      addressLine2: { ...initialFieldState(billingAddress?.addressLine2), required: false },
      city: initialFieldState(billingAddress?.city),
      postalCode: initialFieldState(billingAddress?.postalCode),
      state: initialFieldState(billingAddress?.state),
      country: initialFieldState(billingAddress?.country),
      phoneNumber: initialFieldState(billingAddress?.phoneNumber),
    },
    allPresent: computed((store) => {
      return Boolean(
        Object.keys(store.fields).every(
          (k) => store.fields[k as keyof CreditCardFormFields].isPresent
        ) && store.fields.creditCard.value?.valid
      )
    }),
    loading: initialFieldState(false),
    error: initialFieldState(false),
  }))

  const addressLine1Ref = useRef<Input>(null)
  const addressLine2Ref = useRef<Input>(null)
  const cityRef = useRef<Input>(null)
  const stateRef = useRef<Input>(null)
  const postalCodeRef = useRef<Input>(null)
  const phoneRef = useRef<Input>(null)
  const countryRef = useRef<Select<any>>(null)

  const buildTokenParams = (): CreateCardTokenParams => {
    return {
      type: "Card",
      name: state.fields.fullName.value ?? undefined,
      address: {
        line1: state.fields.addressLine1.value ?? undefined,
        line2: state.fields.addressLine2.value ?? undefined,
        city: state.fields.city.value ?? undefined,
        state: state.fields.state.value ?? undefined,
        country: state.fields.country.value?.shortName ?? undefined,
        postalCode: state.fields.postalCode.value ?? undefined,
      },
    }
  }

  const buildBillingAddress = (): Address => {
    return {
      fullName: state.fields.fullName.value ?? "",
      addressLine1: state.fields.addressLine1.value ?? "",
      addressLine2: state.fields.addressLine2.value ?? "",
      city: state.fields.city.value ?? "",
      state: state.fields.state.value ?? "",
      country: state.fields.country.value ?? { longName: "", shortName: "" },
      postalCode: state.fields.postalCode.value ?? "",
      phoneNumber: state.fields.phoneNumber.value ?? "",
    }
  }

  const handleSubmit = async () => {
    actions.loading.setValue(true)
    actions.error.setValue(false)

    try {
      const tokenBody = buildTokenParams()
      const token = await createToken(tokenBody)

      if (!token || token.error || !token.token.id) {
        throw new Error(`[Stripe]: error creating the token: ${JSON.stringify(token.error)}`)
      }

      onSubmit(token.token, buildBillingAddress())
      actions.loading.setValue(false)
      navigator.pop()
    } catch (error) {
      console.error("CreditCardForm.tsx", error)
      actions.error.setValue(true)
      actions.loading.setValue(false)
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
                actions.fields.creditCard.setValue({
                  valid: cardDetails.complete,
                  params: {
                    expiryMonth: cardDetails.expiryMonth,
                    expiryYear: cardDetails.expiryYear,
                    last4: cardDetails.last4,
                  },
                })
              }}
            />

            {!!state.error.value && (
              <Text testID="error-message" variant="xs" mt={2} color="red100">
                There was an error. Please try again.
              </Text>
            )}
          </>

          <Input
            title="Name on card"
            placeholder="Full name"
            defaultValue={state.fields.fullName.value ?? ""}
            onChangeText={actions.fields.fullName.setValue}
            returnKeyType="next"
            onSubmitEditing={() => addressLine1Ref.current?.focus()}
          />
          <Input
            ref={addressLine1Ref}
            title="Address line 1"
            defaultValue={state.fields.addressLine1.value ?? ""}
            placeholder="Add street address"
            onChangeText={actions.fields.addressLine1.setValue}
            returnKeyType="next"
            onSubmitEditing={() => addressLine2Ref.current?.focus()}
          />
          <Input
            ref={addressLine2Ref}
            title="Address line 2"
            defaultValue={state.fields.addressLine2.value ?? ""}
            optional
            placeholder={[
              "Add your apt, floor, suite, etc.",
              "Add your apt, floor, etc.",
              "Add your apt, etc.",
            ]}
            onChangeText={actions.fields.addressLine2.setValue}
            returnKeyType="next"
            onSubmitEditing={() => cityRef.current?.focus()}
          />
          <Input
            ref={cityRef}
            title="City"
            defaultValue={state.fields.city.value ?? ""}
            onChangeText={actions.fields.city.setValue}
            returnKeyType="next"
            onSubmitEditing={() => stateRef.current?.focus()}
          />
          <Input
            ref={stateRef}
            title="State, province, or region"
            defaultValue={state.fields.state.value ?? ""}
            onChangeText={actions.fields.state.setValue}
            returnKeyType="next"
            onSubmitEditing={() => postalCodeRef.current?.focus()}
          />
          <Input
            ref={postalCodeRef}
            title="Postal Code"
            defaultValue={state.fields.postalCode.value ?? ""}
            onChangeText={actions.fields.postalCode.setValue}
            returnKeyType="next"
            onSubmitEditing={() => phoneRef.current?.focus()}
          />
          <Input
            ref={phoneRef}
            title="Phone"
            placeholder="Add phone number"
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            defaultValue={state.fields.phoneNumber.value ?? ""}
            onChangeText={actions.fields.phoneNumber.setValue}
            onSubmitEditing={() => phoneRef.current?.blur()}
          />

          <Spacer y={1} />

          <CountrySelect
            ref={countryRef}
            onSelectValue={(countryCode: string) =>
              actions.fields.country.setValue({
                shortName: countryCode,
                longName: findCountryNameByCountryCode(countryCode) || "",
              })
            }
            value={state.fields.country.value?.shortName}
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
          disabled={!state.allPresent}
          loading={state.loading.value ?? false}
          block
          width={100}
          onPress={state.allPresent ? handleSubmit : undefined}
        >
          Save
        </Button>
      </Box>
    </ArtsyKeyboardAvoidingView>
  )
}
