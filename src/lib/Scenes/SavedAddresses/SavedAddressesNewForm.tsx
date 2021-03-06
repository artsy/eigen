import { SavedAddressesNewForm_me } from "__generated__/SavedAddressesNewForm_me.graphql"
import { SavedAddressesNewFormQuery } from "__generated__/SavedAddressesNewFormQuery.graphql"
import { Action, action, computed, Computed, createComponentStore } from "easy-peasy"
import { Checkbox } from "lib/Components/Bidding/Components/Checkbox"
import { CountrySelect } from "lib/Components/CountrySelect"
import { Input } from "lib/Components/Input/Input"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { PhoneInput } from "lib/Components/PhoneInput/PhoneInput"
import { Stack } from "lib/Components/Stack"
import { goBack } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderBox, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { times } from "lodash"
import { Flex, Text } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { Alert } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { MyAccountFieldEditScreen } from "../MyAccount/Components/MyAccountFieldEditScreen"
import { AddAddressButton } from "./Components/AddAddressButton"
import { createUserAddress } from "./mutations/addNewAddress"
import { setAsDefaultAddress } from "./mutations/setAsDefaultAddress"

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
  allPresent: Computed<Store, boolean>
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
  allPresent: computed((store) => {
    return Boolean(Object.keys(store.fields).every((k) => store.fields[k as keyof FormFields].isPresent))
  }),
})

export const SavedAddressesNewForm: React.FC<{ me: SavedAddressesNewForm_me }> = ({ me }) => {
  const [state, actions] = useStore()
  const [phoneNumber, setPhoneNumber] = useState(me?.phone)
  const [isDefaultAddress, setIsDefaultAddress] = useState(false)
  const { height } = useScreenDimensions()
  const offSetTop = 0.75

  useEffect(() => {
    setPhoneNumber(me?.phone)
  }, [me?.phone])

  const screenRef = useRef<MyAccountFieldEditScreen>(null)

  const submitAddAddress = async () => {
    try {
      const creatingResponse = await createUserAddress({
        name: state.fields.name.value!,
        country: state.fields.country.value!,
        postalCode: state.fields.postalCode.value,
        addressLine1: state.fields.addressLine1.value!,
        addressLine2: state.fields.addressLine2.value,
        city: state.fields.city.value!,
        region: state.fields.region.value,
        phoneNumber,
      })

      if (isDefaultAddress) {
        await setAsDefaultAddress(creatingResponse.createUserAddress?.userAddressOrErrors.internalID!)
      }
      goBack()
    } catch (e) {
      console.error(e)
      Alert.alert("Something went wrong while attempting to save your address. Please try again or contact us.")
    }
  }

  return (
    <MyAccountFieldEditScreen ref={screenRef} canSave={true} isSaveButtonVisible={false} title="Add New Address">
      <Stack spacing={2}>
        <Input title="Full name" placeholder="Add full name" onChangeText={actions.fields.name.setValue} />
        <CountrySelect onSelectValue={actions.fields.country.setValue} value={state.fields.country.value} />
        <Input title="Postal Code" placeholder="Add postal code" onChangeText={actions.fields.postalCode.setValue} />
        <Input title="Address line 1" placeholder="Add address" onChangeText={actions.fields.addressLine1.setValue} />
        <Input
          title="Address line 2 (optional)"
          placeholder="Add address line 2"
          onChangeText={actions.fields.addressLine2.setValue}
        />
        <Input title="City" placeholder="Add city" onChangeText={actions.fields.city.setValue} />
        <Input
          title="State, province, or region"
          placeholder="Add state, province, or region"
          onChangeText={actions.fields.region.setValue}
        />
        <PhoneInput
          title="Phone number"
          value={phoneNumber ?? ""}
          maxModalHeight={height * offSetTop}
          onChangeText={setPhoneNumber}
        />
        <Checkbox
          onPress={() => {
            setIsDefaultAddress(!isDefaultAddress)
          }}
          checked={isDefaultAddress}
          mb={4}
        >
          <Text>Set as default</Text>
        </Checkbox>

        <AddAddressButton handleOnPress={submitAddAddress} title="Add Address" disabled={!state.allPresent} />
      </Stack>
    </MyAccountFieldEditScreen>
  )
}

export const SavedAddressesNewFormContainer = createFragmentContainer(SavedAddressesNewForm, {
  me: graphql`
    fragment SavedAddressesNewForm_me on Me {
      id
      phone
      addressConnection(first: 3) {
        edges {
          node {
            internalID
            name
            addressLine1
            addressLine2
            addressLine3
            city
            region
            postalCode
          }
        }
      }
    }
  `,
})

export const SavedAddressesFormPlaceholder: React.FC = () => {
  return (
    <PageWithSimpleHeader title="Add New Address">
      <Flex px={2} py={15}>
        {times(5).map((index: number) => (
          <Flex key={index} py={1}>
            <PlaceholderText height={15} width={50 + Math.random() * 100} />
            <PlaceholderBox height={45} width={"100%"} />
          </Flex>
        ))}
      </Flex>
    </PageWithSimpleHeader>
  )
}

export const SavedAddressesNewFormQueryRenderer: React.FC<{}> = () => (
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
      renderPlaceholder: () => <SavedAddressesFormPlaceholder />,
    })}
    variables={{}}
  />
)
