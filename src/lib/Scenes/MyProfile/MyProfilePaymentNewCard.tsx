import { color, Sans } from "@artsy/palette"
import { fontFamily } from "@artsy/palette/dist/platform/fonts"
import { Action, action, computed, Computed, createComponentStore } from "easy-peasy"
import { Input } from "lib/Components/Input/Input"
import { Stack } from "lib/Components/Stack"
import { useInterval } from "lib/utils/useInterval"
import React, { useRef, useState } from "react"
// @ts-ignore
import stripe, { PaymentCardTextField, StripeToken } from "tipsi-stripe"
import { MyAccountFieldEditScreen } from "../MyAccount/Components/MyAccountFieldEditScreen"

interface FormField {
  value: string | null
  touched: boolean
  required: boolean
}
const emptyFieldState: FormField = {
  value: null,
  touched: false,
  required: true,
}

interface FormFields {
  name: FormField
  addressLine1: FormField
  addressLine2: FormField
  city: FormField
  postCode: FormField
  state: FormField
  country: FormField
}

interface Store {
  fields: FormFields
  errors: { [key in keyof FormFields]: Computed<Store, string | undefined> }
  setFieldValue: Action<Store, { field: keyof FormFields; value: string }>
}

const getFieldError = (fieldName: keyof FormFields) => (store: { fields: FormFields }) => {
  if (!store?.fields) {
    return
  }
  const { touched, value, required } = store.fields[fieldName]
  if (required && touched && !value) {
    return "This field is required"
  }
}

const useStore = createComponentStore<Store>({
  fields: {
    name: emptyFieldState,
    addressLine1: emptyFieldState,
    addressLine2: { ...emptyFieldState, required: false },
    city: emptyFieldState,
    postCode: emptyFieldState,
    state: emptyFieldState,
    country: emptyFieldState,
  },
  errors: {
    name: computed(getFieldError("name")),
    addressLine1: computed(getFieldError("addressLine1")),
    addressLine2: computed(getFieldError("addressLine2")),
    city: computed(getFieldError("city")),
    postCode: computed(getFieldError("postCode")),
    state: computed(getFieldError("state")),
    country: computed(getFieldError("country")),
  },
  setFieldValue: action((state, payload) => {
    state.fields[payload.field].value = payload.value.trim()
  }),
})

export const MyProfilePaymentNewCard: React.FC<{}> = ({}) => {
  const [state, actions] = useStore()
  const [cardFieldIsFocused, setCardFieldIsFocused] = useState(false)
  const paymentInfoRef = useRef<any>(null)
  useInterval(() => {
    setCardFieldIsFocused(paymentInfoRef.current?.isFocused() ?? false)
  }, 100)
  return (
    <MyAccountFieldEditScreen canSave={false} title="Add new card" onSave={async () => null}>
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
              borderColor: cardFieldIsFocused ? color("purple100") : color("black10"),
              borderWidth: 1,
              borderRadius: 0,
            }}
            onParamsChange={() => null}
            numberPlaceholder="Card number"
            expirationPlaceholder="MM/YY"
            cvcPlaceholde="CVC"
          />
        </>
        <Input
          title="Name on card"
          placeholder="Full name"
          onChangeText={value => actions.setFieldValue({ field: "name", value })}
          error={state.errors.name}
        />
        <Input
          title="Address line 1"
          placeholder="Add street address"
          onChangeText={value => actions.setFieldValue({ field: "addressLine1", value })}
          error={state.errors.addressLine1}
        />
        <Input
          title="Address line 2 (optional)"
          placeholder="Add apt, floor, suite, etc."
          onChangeText={value => actions.setFieldValue({ field: "addressLine2", value })}
          error={state.errors.addressLine2}
        />
        <Input
          title="City"
          placeholder="Add city"
          onChangeText={value => actions.setFieldValue({ field: "city", value })}
          error={state.errors.city}
        />
        <Input
          title="Postal Code"
          placeholder="Add postal code"
          onChangeText={value => actions.setFieldValue({ field: "postCode", value })}
          error={state.errors.postCode}
        />
        <Input
          title="State, province, or region"
          placeholder="Add State, Province, or Region"
          onChangeText={value => actions.setFieldValue({ field: "state", value })}
          error={state.errors.state}
        />
        <Input title="Country" />
      </Stack>
    </MyAccountFieldEditScreen>
  )
}
