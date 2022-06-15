import { captureMessage } from "@sentry/react-native"
import { SavedAddressesForm_me$data } from "__generated__/SavedAddressesForm_me.graphql"
import { SavedAddressesFormQuery } from "__generated__/SavedAddressesFormQuery.graphql"
import { CountrySelect } from "app/Components/CountrySelect"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { Stack } from "app/Components/Stack"
import { useToast } from "app/Components/Toast/toastHook"
import { goBack } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { PlaceholderBox, PlaceholderText } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { Action, action, computed, Computed, createComponentStore } from "easy-peasy"
import { times } from "lodash"
import { Flex, Input, Text } from "palette"
import { Checkbox } from "palette/elements/Checkbox"
import { cleanUserPhoneNumber } from "palette/elements/Input/PhoneInput/cleanUserPhoneNumber"
import { countryCodes } from "palette/elements/Input/PhoneInput/countries"
import { PhoneInput } from "palette/elements/Input/PhoneInput/PhoneInput"
import React, { useEffect, useRef, useState } from "react"
import { Alert } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { useScreenDimensions } from "shared/hooks"
import { MyAccountFieldEditScreen } from "../MyAccount/Components/MyAccountFieldEditScreen"
import { AddAddressButton } from "./Components/AddAddressButton"
import { createUserAddress } from "./mutations/addNewAddress"
import { deleteSavedAddress } from "./mutations/deleteSavedAddress"
import { setAsDefaultAddress } from "./mutations/setAsDefaultAddress"
import { updateUserAddress } from "./mutations/updateUserAddress"

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
    return Boolean(
      Object.keys(store.fields).every((k) => store.fields[k as keyof FormFields].isPresent)
    )
  }),
})

export const SavedAddressesForm: React.FC<{
  me: SavedAddressesForm_me$data
  addressId?: string
}> = ({ me, addressId }) => {
  const isEditForm = !!addressId
  const toast = useToast()
  const [isValidNumber, setIsValidNumber] = useState<boolean>(false)
  const [state, actions] = useStore()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isDefaultAddress, setIsDefaultAddress] = useState(false)
  const { height } = useScreenDimensions()
  const offSetTop = 0.75

  useEffect(() => {
    if (isEditForm) {
      const addresses = extractNodes(me.addressConnection)
      const selectedAddress = addresses!.find((address) => address.internalID === addressId)
      setPhoneNumber(selectedAddress?.phoneNumber!)
      Object.keys(actions.fields).forEach((field) => {
        const fieldValue = selectedAddress?.[field as keyof FormFields] ?? ""
        actions.fields[field as keyof FormFields].setValue(fieldValue)
      })
      setIsDefaultAddress(!!selectedAddress?.isDefault)
    }
  }, [])

  const screenRef = useRef<MyAccountFieldEditScreen>(null)

  const submitAddAddress = async () => {
    const phoneNumberCountryCode =
      countryCodes[cleanUserPhoneNumber(phoneNumber)?.countryCode?.toLocaleUpperCase()]

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
        phoneNumberCountryCode,
      })

      if (isDefaultAddress) {
        await setAsDefaultAddress(
          creatingResponse.createUserAddress?.userAddressOrErrors.internalID!
        )
      }
      if (!creatingResponse.createUserAddress?.userAddressOrErrors.errors) {
        toast.show("Address successfully added", "top")
      }
      goBack()
    } catch (e: any) {
      captureMessage(e.stack)
      Alert.alert(
        "Something went wrong while attempting to save your address. Please try again or contact us."
      )
    }
  }

  const editUserAddress = async (userAddressID: string) => {
    const phoneNumberCountryCode =
      countryCodes[cleanUserPhoneNumber(phoneNumber)?.countryCode?.toLocaleUpperCase()]

    try {
      const response = await updateUserAddress(userAddressID, {
        name: state.fields.name.value!,
        country: state.fields.country.value!,
        postalCode: state.fields.postalCode.value,
        addressLine1: state.fields.addressLine1.value!,
        addressLine2: state.fields.addressLine2.value,
        city: state.fields.city.value!,
        region: state.fields.region.value,
        phoneNumber,
        phoneNumberCountryCode,
      })

      if (isDefaultAddress) {
        await setAsDefaultAddress(response.updateUserAddress?.userAddressOrErrors.internalID!)
      }
      if (!response.updateUserAddress?.userAddressOrErrors.errors) {
        toast.show("Address successfully edited", "top")
      }
      goBack()
    } catch (e: any) {
      Alert.alert(
        "Something went wrong while attempting to save your address. Please try again or contact us."
      )
      captureMessage(e.stack)
    }
  }

  const deleteUserAddress = async (userAddressID: string) => {
    deleteSavedAddress(
      userAddressID,
      () => {
        goBack()
        toast.show("Address successfully deleted", "top")
      },
      (message: string) => captureMessage(message)
    )
  }

  return (
    <MyAccountFieldEditScreen
      ref={screenRef}
      canSave
      isSaveButtonVisible={false}
      title={isEditForm ? "Edit Address" : "Add New Address"}
    >
      <Stack spacing={2}>
        <Input
          title="Full name"
          placeholder="Add full name"
          value={state.fields.name.value ?? ""}
          onChangeText={actions.fields.name.setValue}
        />
        <CountrySelect
          onSelectValue={actions.fields.country.setValue}
          value={state.fields.country.value}
        />
        <Input
          title="Postal Code"
          placeholder="Add postal code"
          value={state.fields.postalCode.value ?? ""}
          onChangeText={actions.fields.postalCode.setValue}
        />
        <Input
          title="Address line 1"
          placeholder="Add address"
          value={state.fields.addressLine1.value ?? ""}
          onChangeText={actions.fields.addressLine1.setValue}
        />
        <Input
          title="Address line 2"
          optional
          placeholder="Add address line 2"
          value={state.fields.addressLine2.value ?? ""}
          onChangeText={actions.fields.addressLine2.setValue}
        />
        <Input
          title="City"
          placeholder="Add city"
          value={state.fields.city.value ?? ""}
          onChangeText={actions.fields.city.setValue}
        />
        <Input
          title="State, province, or region"
          placeholder="Add state, province, or region"
          value={state.fields.region.value ?? ""}
          onChangeText={actions.fields.region.setValue}
        />
        <PhoneInput
          setValidation={setIsValidNumber}
          title="Phone number"
          description="Required for shipping logistics"
          value={phoneNumber ?? ""}
          maxModalHeight={height * offSetTop}
          onChangeText={setPhoneNumber}
        />
        <Checkbox
          onPress={() => {
            setIsDefaultAddress(!isDefaultAddress)
          }}
          checked={isDefaultAddress}
          mb={1}
        >
          <Text>Set as default</Text>
        </Checkbox>

        {!!isEditForm && (
          <Text
            onPress={() => deleteUserAddress(addressId!)}
            variant="xs"
            textAlign="center"
            mb={2}
            color="red"
          >
            Delete address
          </Text>
        )}

        <AddAddressButton
          handleOnPress={isEditForm ? () => editUserAddress(addressId!) : submitAddAddress}
          title={isEditForm ? "Add" : "Add Address"}
          disabled={!isValidNumber || !state.allPresent}
        />
      </Stack>
    </MyAccountFieldEditScreen>
  )
}

export const SavedAddressesFormContainer = createFragmentContainer(SavedAddressesForm, {
  me: graphql`
    fragment SavedAddressesForm_me on Me {
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
            country
            city
            region
            postalCode
            phoneNumber
            isDefault
          }
        }
      }
    }
  `,
})

export const SavedAddressesFormPlaceholder: React.FC<{ addressId?: string }> = (props) => {
  return (
    <PageWithSimpleHeader title={!!props?.addressId ? "Edit Address" : "Add New Address"}>
      <Flex px={2} py={15}>
        {times(5).map((index) => (
          <Flex key={index} py={1}>
            <PlaceholderText height={15} width={50 + Math.random() * 100} />
            <PlaceholderBox height={45} width="100%" />
          </Flex>
        ))}
      </Flex>
    </PageWithSimpleHeader>
  )
}

export const SavedAddressesFormQueryRenderer: React.FC<{}> = (props) => (
  <QueryRenderer<SavedAddressesFormQuery>
    environment={defaultEnvironment}
    query={graphql`
      query SavedAddressesFormQuery {
        me {
          ...SavedAddressesForm_me
        }
      }
    `}
    render={renderWithPlaceholder({
      initialProps: props,
      Container: SavedAddressesFormContainer,
      renderPlaceholder: () => <SavedAddressesFormPlaceholder {...props} />,
    })}
    variables={{}}
  />
)
