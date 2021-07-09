import { Action, action, computed, Computed, createComponentStore } from "easy-peasy"
import { CountrySelect } from "lib/Components/CountrySelect"
import { Input } from "lib/Components/Input/Input"
import { Select } from "lib/Components/Select"
import { Stack } from "lib/Components/Stack"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import React, { useEffect, useRef, useState } from "react"
import { commitMutation, createFragmentContainer, graphql, QueryRenderer } from "react-relay"
// @ts-ignore
import stripe from "tipsi-stripe"
import { MyAccountFieldEditScreen } from "../MyAccount/Components/MyAccountFieldEditScreen"
// import { __triggerRefresh } from "./MyProfilePayment"

import { SavedAddressesNewFormQuery } from "__generated__/SavedAddressesNewFormQuery.graphql"
import { PhoneInput } from "lib/Components/PhoneInput/PhoneInput"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box } from "palette"

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
  allPresent: computed((store) => {
    return Boolean(
      Object.keys(store.fields).every((k) => store.fields[k as keyof FormFields].isPresent) &&
        store.fields.creditCard.value?.valid
    )
  }),
})

export const SavedAddressesNewForm: React.FC<{ me: any }> = ({ me }) => {
  const [state, actions] = useStore()
  const paymentInfoRef = useRef<any>(null)
  const [phoneNumber, setPhoneNumber] = useState(me?.phone)
  const addressLine1Ref = useRef<Input>(null)
  const addressLine2Ref = useRef<Input>(null)
  const cityRef = useRef<Input>(null)
  const postalCodeRef = useRef<Input>(null)
  const stateRef = useRef<Input>(null)
  const countryRef = useRef<Select<any>>(null)
  const phoneRef = useRef<Input>(null)
  const { width, height } = useScreenDimensions()

  // focus top field on mount
  useEffect(() => {
    paymentInfoRef.current?.focus()
  }, [])

  useEffect(() => {
    setPhoneNumber(me?.phone)
  }, [me?.phone])

  const screenRef = useRef<MyAccountFieldEditScreen>(null)

  return (
    <MyAccountFieldEditScreen
      ref={screenRef}
      canSave={state.allPresent}
      title="Add New Address"
      onSave={async (dismiss, alert) => {
        console.log("cry")
      }}
    >
      <Stack spacing={2}>
        <Input
          title="Full name"
          placeholder="Add full name"
          onChangeText={actions.fields.fullName.setValue}
          returnKeyType="next"
          onSubmitEditing={() => addressLine1Ref.current?.focus()}
        />
        <CountrySelect
          ref={countryRef}
          onSelectValue={actions.fields.country.setValue}
          value={state.fields.country.value}
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
          ref={addressLine1Ref}
          title="Address line 1"
          placeholder="Add address"
          onChangeText={actions.fields.addressLine1.setValue}
          returnKeyType="next"
          onSubmitEditing={() => addressLine2Ref.current?.focus()}
        />
        <Input
          ref={addressLine2Ref}
          title="Address line 2 (optional)"
          placeholder="Add address line 2"
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
          ref={stateRef}
          title="State, province, or region"
          placeholder="Add state, province, or r egion"
          onChangeText={actions.fields.state.setValue}
          onSubmitEditing={() => {
            stateRef.current?.blur()
            screenRef.current?.scrollToEnd()
            setTimeout(() => {
              countryRef.current?.open()
            }, 100)
          }}
          returnKeyType="next"
        />
        <PhoneInput
          ref={phoneRef}
          title="Phone number"
          value={phoneNumber ?? ""}
          maxModalHeight={height * 0.75}
          onChangeText={setPhoneNumber}
          // onFocus={() => setIsInputFocused(true)}
          // onBlur={() => setIsInputFocused(false)}
        />
      </Stack>
    </MyAccountFieldEditScreen>
  )
}

const SavedAddressesNewFormContainer = createFragmentContainer(SavedAddressesNewForm, {
  me: graphql`
    fragment SavedAddressesNewForm_me on Me {
      phone
    }
  `,
})

export const SavedAddressesNewFormQueryRenderer: React.FC<{}> = () => {
  return (
    <QueryRenderer<SavedAddressesNewFormQuery>
      environment={defaultEnvironment}
      query={graphql`
        query SavedAddressesNewFormQuery {
          me {
            ...SavedAddressesNewForm_me
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: SavedAddressesNewFormContainer,
        renderPlaceholder: () => <Box></Box>,
      })}
      variables={{}}
    />
  )
}

// const saveCreditCard = (token: string) => {
//   return new Promise<MyProfilePaymentNewCreditCardSaveCardMutation["response"]>((resolve, reject) => {
//     commitMutation<MyProfilePaymentNewCreditCardSaveCardMutation>(defaultEnvironment, {
//       mutation: graphql`
//         mutation MyProfilePaymentNewCreditCardSaveCardMutation($input: CreditCardInput!) {
//           createCreditCard(input: $input) {
//             creditCardOrError {
//               ... on CreditCardMutationSuccess {
//                 creditCard {
//                   internalID
//                 }
//               }
//               ... on CreditCardMutationFailure {
//                 mutationError {
//                   detail
//                   error
//                   message
//                 }
//               }
//             }
//           }
//         }
//       `,
//       onCompleted: resolve,
//       onError: reject,
//       variables: {
//         input: {
//           oneTimeUse: false,
//           token,
//         },
//       },
//     })
//   })
// }
