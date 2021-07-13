import { SavedAddressesNewForm_me } from "__generated__/SavedAddressesNewForm_me.graphql"
import { SavedAddressesNewFormQuery } from "__generated__/SavedAddressesNewFormQuery.graphql"
import { Action, action, computed, Computed, createComponentStore } from "easy-peasy"
import { Checkbox } from "lib/Components/Bidding/Components/Checkbox"
import { CountrySelect } from "lib/Components/CountrySelect"
import { Input } from "lib/Components/Input/Input"
import { PhoneInput } from "lib/Components/PhoneInput/PhoneInput"
import { Stack } from "lib/Components/Stack"
import { goBack } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, Button, Text } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { Alert } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { MyAccountFieldEditScreen } from "../MyAccount/Components/MyAccountFieldEditScreen"
import { createUserAddress } from "./addNewAddress"
import { setAsDefaultAddress } from "./setAsDefaultAddress"

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
})

export const SavedAddressesNewForm: React.FC<{ me: SavedAddressesNewForm_me }> = ({ me }) => {
  const [state, actions] = useStore()
  const [phoneNumber, setPhoneNumber] = useState(me?.phone)
  const [isDefaultAddress, setIsDefaultAddress] = useState(false)
  const { height } = useScreenDimensions()

  useEffect(() => {
    setPhoneNumber(me?.phone)
  }, [me?.phone])

  const screenRef = useRef<MyAccountFieldEditScreen>(null)

  const submitAddAddress = async () => {
    try {
      // response from mutation
      const creatingResponse = await createUserAddress({
        name: state.fields.name.value!,
        country: state.fields.country.value!,
        postalCode: state.fields.country.value,
        addressLine1: state.fields.country.value!,
        addressLine2: state.fields.country.value,
        city: state.fields.country.value!,
        region: state.fields.country.value,
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
    <MyAccountFieldEditScreen ref={screenRef} canSave={true} hideSave={true} title="Add New Address">
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
          placeholder="Add state, province, or r egion"
          onChangeText={actions.fields.region.setValue}
        />
        <PhoneInput
          title="Phone number"
          value={phoneNumber ?? ""}
          maxModalHeight={height * 0.75}
          onChangeText={setPhoneNumber}
        />
        <Checkbox
          onPress={() => {
            setIsDefaultAddress(!isDefaultAddress)
          }}
          checked={isDefaultAddress}
          mb={40}
        >
          <Text>Set as default</Text>
        </Checkbox>
        <Button
          block
          borderRadius={50}
          variant="primaryBlack"
          width={100}
          onPress={() => {
            submitAddAddress()
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
