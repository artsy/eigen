import { Action, action, computed, Computed, createComponentStore } from "easy-peasy"
import { CountrySelect } from "lib/Components/CountrySelect"
import { Input } from "lib/Components/Input/Input"
import { Select } from "lib/Components/Select"
import { Stack } from "lib/Components/Stack"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import React, { useEffect, useRef, useState } from "react"
import { commitMutation, createFragmentContainer, Environment, graphql, QueryRenderer } from "react-relay"
// @ts-ignore
import stripe from "tipsi-stripe"
import { MyAccountFieldEditScreen } from "../MyAccount/Components/MyAccountFieldEditScreen"
// import { __triggerRefresh } from "./MyProfilePayment"

import { SavedAddressesNewForm_me } from "__generated__/SavedAddressesNewForm_me.graphql"
import {
  SavedAddressesNewFormMutation,
  SavedAddressesNewFormMutationResponse,
  UserAddressAttributes,
} from "__generated__/SavedAddressesNewFormMutation.graphql"
import { SavedAddressesNewFormQuery } from "__generated__/SavedAddressesNewFormQuery.graphql"
import { Checkbox } from "lib/Components/Bidding/Components/Checkbox"
import { PhoneInput } from "lib/Components/PhoneInput/PhoneInput"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, Button, Text } from "palette"
import { ConnectionHandler, RecordSourceSelectorProxy } from "relay-runtime"

// interface CreditCardInputParams {
//   cvc: string
//   expMonth: number
//   expYear: number
//   number: string
// }

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
  addressLine1: FormField
  addressLine2: FormField
  city: FormField
  country: FormField
  name: FormField
  postalCode: FormField
  region: FormField
}

interface Store {
  fields: FormFields
  // allPresent: Computed<Store, boolean>
}

const useStore = createComponentStore<Store>({
  fields: {
    name: emptyFieldState(),
    country: emptyFieldState(),
    postalCode: emptyFieldState(),
    addressLine1: emptyFieldState(),
    addressLine2: { ...emptyFieldState(), required: false },
    city: emptyFieldState(),
    region: emptyFieldState(),
  },
  // allPresent: computed((store) => {
  //   return Boolean(
  //     Object.keys(store.fields).every((k) => store.fields[k as keyof FormFields].isPresent) &&
  //       store.fields.creditCard.value?.valid
  //   )
  // }),
})

export const SavedAddressesNewForm: React.FC<{ me: SavedAddressesNewForm_me }> = ({ me }) => {
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
  const { height } = useScreenDimensions()

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
      canSave={true}
      hideSave={false}
      title="Add New Address"
      onSave={async (dismiss, alert) => {
        alert("суки")
        console.log(state, "mystate")

        try {
          createUserAddress(
            defaultEnvironment,
            {
              name: state.fields.name.value!,
              country: state.fields.country.value!,
              postalCode: state.fields.country.value,
              addressLine1: state.fields.country.value!,
              addressLine2: state.fields.country.value,
              city: state.fields.country.value!,
              region: state.fields.country.value,
              phoneNumber,
            },
            me
          )
          console.log(state, "mystate")

          dismiss()
        } catch (e) {
          console.error(e)
          alert("Something went wrong while attempting to save your credit card. Please try again or contact us.")
        }
      }}
    >
      <Stack spacing={2}>
        <Input
          title="Full name"
          placeholder="Add full name"
          onChangeText={actions.fields.name.setValue}
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
          onChangeText={actions.fields.postalCode.setValue}
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
          onChangeText={actions.fields.region.setValue}
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
        <Checkbox mb={40}>
          <Text>Set as default</Text>
        </Checkbox>
        <Button
          block
          borderRadius={50}
          variant="primaryBlack"
          width={100}
          onPress={() => {
            console.log(1)
          }}
        >
          Add Address
        </Button>
      </Stack>
    </MyAccountFieldEditScreen>
  )
}

const SavedAddressesNewFormContainer = createFragmentContainer(SavedAddressesNewForm, {
  me: graphql`
    fragment SavedAddressesNewForm_me on Me {
      id
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

const onAddressAdded = (
  me: SavedAddressesNewForm_me,
  store: RecordSourceSelectorProxy<any>,
  data: SavedAddressesNewFormMutationResponse
): void => {
  const response = data?.createUserAddress?.userAddressOrErrors

  if (response) {
    const meStore = store.get(me.id)
    const connection = ConnectionHandler.getConnection(
      // @ts-expect-error STRICT_NULL_CHECK
      meStore,
      "SavedAddresses_addressConnection"
    )
    const mutationPayload = store.getRootField("createUserAddress")

    const createUserAddressOrError = mutationPayload.getLinkedRecord("userAddressOrErrors")
    // @ts-expect-error STRICT_NULL_CHECK
    ConnectionHandler.insertEdgeAfter(connection, createUserAddressOrError)
  }
}

export const createUserAddress = async (
  environment: Environment,
  address: UserAddressAttributes,
  // onSuccess: (address: SavedAddressesNewFormMutationResponse | null) => void,
  // onError: (message: string | null) => void,
  me: SavedAddressesNewForm_me
) => {
  commitMutation<SavedAddressesNewFormMutation>(environment, {
    variables: {
      input: {
        attributes: address,
      },
    },
    mutation: graphql`
      mutation SavedAddressesNewFormMutation($input: CreateUserAddressInput!) {
        createUserAddress(input: $input) {
          userAddressOrErrors {
            ... on UserAddress {
              id
              internalID
              addressLine1
              addressLine2
              city
              country
              isDefault
              name
              phoneNumber
              postalCode
              region
            }
            ... on Errors {
              errors {
                message
              }
            }
          }
        }
      }
    `,
    updater: (store, data: SavedAddressesNewFormMutationResponse) => {
      onAddressAdded(me, store, data)
    },
    onCompleted: (data) => {
      // @ts-expect-error STRICT_NULL_CHECK
      const errors = data.createUserAddress.userAddressOrErrors.errors
      if (errors) {
        console.log(errors)
        // onError(errors.map((error) => error.message).join(", "))
      } else {
        // onSuccess(data)
      }
    },
    onError: (e) => {
      console.log(e.message)
      // onError(e.message)
    },
  })
}
