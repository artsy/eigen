import { color, Sans } from "@artsy/palette"
import { fontFamily } from "@artsy/palette/dist/platform/fonts"
import { Action, action, computed, Computed, createComponentStore } from "easy-peasy"
import { Input } from "lib/Components/Input/Input"
import { Stack } from "lib/Components/Stack"
import { useInterval } from "lib/utils/useInterval"
import React, { useEffect, useRef, useState } from "react"
// @ts-ignore
import { PaymentCardTextField } from "tipsi-stripe"
import { MyAccountFieldEditScreen } from "../MyAccount/Components/MyAccountFieldEditScreen"

interface CreditCardInputParams {
  cvc: string
  expMonth: number
  expYear: number
  number: string
}

interface FormField<Type = string> {
  value: Type | null
  touched: boolean
  required: boolean
  isPresent: Computed<this, boolean>
  setValue: Action<this, Type>
}
const emptyFieldState: () => FormField<any> = () => ({
  value: null,
  touched: false,
  required: true,
  isPresent: computed(self => {
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

interface FormFields {
  creditCard: FormField<{
    valid: boolean
    params: CreditCardInputParams
  }>
  fullName: FormField
  addressLine1: FormField
  addressLine2: FormField
  city: FormField
  postCode: FormField
  state: FormField
  country: FormField
}

interface Store {
  fields: FormFields
  allPresent: Computed<Store, boolean>
}

const useStore = createComponentStore<Store>({
  fields: {
    creditCard: emptyFieldState(),
    fullName: emptyFieldState(),
    addressLine1: emptyFieldState(),
    addressLine2: { ...emptyFieldState(), required: false },
    city: emptyFieldState(),
    postCode: emptyFieldState(),
    state: emptyFieldState(),
    country: emptyFieldState(),
  },
  allPresent: computed(store => {
    return Boolean(
      Object.keys(store.fields).every(k => store.fields[k as keyof FormFields].isPresent) &&
        store.fields.creditCard.value?.valid
    )
  }),
})

export const MyProfilePaymentNewCreditCard: React.FC<{}> = ({}) => {
  const [state, actions] = useStore()
  console.log(state.fields.fullName)
  const [cardFieldIsFocused, setCardFieldIsFocused] = useState(false)
  const paymentInfoRef = useRef<any>(null)

  const addressLine1Ref = useRef<Input>(null)
  const addressLine2Ref = useRef<Input>(null)
  const cityRef = useRef<Input>(null)
  const postalCodeRef = useRef<Input>(null)
  const stateRef = useRef<Input>(null)

  // focus top field on mount
  useEffect(() => {
    paymentInfoRef.current?.focus()
  }, [])

  useInterval(() => {
    setCardFieldIsFocused(paymentInfoRef.current?.isFocused() ?? false)
  }, 100)

  return (
    <MyAccountFieldEditScreen canSave={state.allPresent} title="Add new card" onSave={async () => null}>
      <Stack spacing={2}>
        <>
          <Sans size="3" mb={0.5}>
            Credit card
          </Sans>
          <PaymentCardTextField
            ref={paymentInfoRef}
            style={{
              fontFamily: fontFamily.sans.regular,
              height: 40,
              fontSize: 14,
              width: "100%",
              borderColor: cardFieldIsFocused
                ? state.fields.creditCard.value?.valid === false
                  ? color("red100")
                  : color("purple100")
                : color("black10"),
              borderWidth: 1,
              borderRadius: 0,
            }}
            onParamsChange={(valid: boolean, params: CreditCardInputParams) =>
              actions.fields.creditCard.setValue({
                valid,
                params,
              })
            }
            numberPlaceholder="Card number"
            expirationPlaceholder="MM/YY"
            cvcPlaceholde="CVC"
          />
        </>
        <Input
          title="Name on card"
          placeholder="Full name"
          onChangeText={actions.fields.fullName.setValue}
          returnKeyType="next"
          onSubmitEditing={() => addressLine1Ref.current?.focus()}
        />
        <Input
          ref={addressLine1Ref}
          title="Address line 1"
          placeholder="Add street address"
          onChangeText={actions.fields.addressLine1.setValue}
          returnKeyType="next"
          onSubmitEditing={() => addressLine2Ref.current?.focus()}
        />
        <Input
          ref={addressLine2Ref}
          title="Address line 2 (optional)"
          placeholder="Add apt, floor, suite, etc."
          onChangeText={actions.fields.addressLine2.setValue}
          returnKeyType="next"
          onSubmitEditing={() => cityRef.current?.focus()}
        />
        <Input
          ref={cityRef}
          title="City"
          placeholder="Add city"
          onChangeText={actions.fields.city.setValue}
          returnKeyType="next"
          onSubmitEditing={() => postalCodeRef.current?.focus()}
        />
        <Input
          ref={postalCodeRef}
          title="Postal Code"
          placeholder="Add postal code"
          onChangeText={actions.fields.postCode.setValue}
          returnKeyType="next"
          onSubmitEditing={() => stateRef.current?.focus()}
        />
        <Input
          ref={stateRef}
          title="State, province, or region"
          placeholder="Add State, Province, or Region"
          onChangeText={actions.fields.state.setValue}
          returnKeyType="next"
        />
        <Input title="Country" onChangeText={actions.fields.country.setValue} />
      </Stack>
    </MyAccountFieldEditScreen>
  )
}
