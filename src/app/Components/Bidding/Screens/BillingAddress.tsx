import { ArtsyKeyboardAvoidingView } from "app/Components/ArtsyKeyboardAvoidingView"
import { CountrySelect } from "app/Components/CountrySelect"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { Stack } from "app/Components/Stack"
import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import { ScreenDimensionsContext } from "app/utils/useScreenDimensions"
import { Button, Flex, Input, Sans } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { ScrollView } from "react-native"
import { Schema, screenTrack, track } from "../../../utils/track"
import { Address } from "../types"
import { findCountryNameByCountryCode } from "../Utils/findCountryNameByCountryCode"
import { validateAddressFieldsPresence } from "../Validators/validateAddressFieldsPresence"

interface BillingAddressProps {
  onSubmit: (values: Address) => void
  navigator: NavigatorIOS
  billingAddress?: Address
}

screenTrack({
  context_screen: Schema.PageNames.BidFlowBillingAddressPage,
  context_screen_owner_type: null,
})

export const BillingAddress: React.FC<BillingAddressProps> = ({
  onSubmit,
  navigator,
  billingAddress,
}) => {
  const scrollViewRef = useRef<ScrollView>(null)

  const fullNameRef = useRef<Input>(null)
  const addressLine1Ref = useRef<Input>(null)
  const addressLine2Ref = useRef<Input>(null)
  const cityRef = useRef<Input>(null)
  const stateRef = useRef<Input>(null)
  const postalCodeRef = useRef<Input>(null)
  const phoneRef = useRef<Input>(null)

  const [address, setAddress] = useState<Address>({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: {
      longName: "",
      shortName: "",
    },
    postalCode: "",
    phoneNumber: "",
  })

  const [addressFieldsWithError, setAddressFieldsWithError] = useState<string[]>([])

  // focus on the initial input on mount
  useEffect(() => {
    fullNameRef.current?.focus()
  }, [])

  // set billing address, if passed as prop
  useEffect(() => {
    if (billingAddress) {
      setAddress(billingAddress)
    }
  }, [])

  // fired on each input change -> updates the relevant field in local state
  const handleInputTextChange = (inputName: string, value: string): void => {
    setAddress({
      ...address,
      [inputName]: value,
    })
  }

  // updates the country field in local state with short & long names
  const handleCountrySelection = (countryCode: string): void => {
    setAddress({
      ...address,
      country: {
        shortName: countryCode,
        longName: findCountryNameByCountryCode(countryCode) || "",
      },
    })
  }

  // validates required fields & submits address
  const handleAddBillingAddressClick = (): void => {
    const errors = validateAddressFieldsPresence(address)

    setAddressFieldsWithError(errors)

    if (!errors.length) {
      onSubmit(address)
      navigator?.pop()
      track({
        action_type: Schema.ActionTypes.Success,
        action_name: Schema.ActionNames.BidFlowSaveBillingAddress,
      })
    }
  }

  // checks if the passed address field is empty & return appropriate str
  const checkFieldError = (field: string): string => {
    return addressFieldsWithError.includes(field) ? "*This field is required" : ""
  }

  return (
    <ArtsyKeyboardAvoidingView>
      <FancyModalHeader onLeftButtonPress={() => navigator?.pop()}>
        Add billing address
      </FancyModalHeader>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ padding: 20, paddingBottom: 50 }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <Stack spacing={3}>
          <Input
            ref={fullNameRef}
            title="Full name"
            placeholder="Add your full name"
            textContentType="name"
            returnKeyType="next"
            enableClearButton
            error={checkFieldError("fullName")}
            value={address.fullName}
            onChangeText={(e) => handleInputTextChange("fullName", e)}
            testID="input-full-name"
          />

          <Input
            ref={addressLine1Ref}
            title="Address line 1"
            placeholder="Add your street address"
            textContentType="streetAddressLine1"
            returnKeyType="next"
            enableClearButton
            error={checkFieldError("addressLine1")}
            value={address.addressLine1}
            onChangeText={(e) => handleInputTextChange("addressLine1", e)}
            testID="input-address-1"
          />

          <Input
            ref={addressLine2Ref}
            title="Address line 2"
            optional
            placeholder="Add your apt, floor, suite, etc."
            textContentType="streetAddressLine2"
            returnKeyType="next"
            enableClearButton
            value={address.addressLine2}
            onChangeText={(e) => handleInputTextChange("addressLine2", e)}
            testID="input-address-2"
          />

          <Input
            ref={cityRef}
            title="City"
            placeholder="Add your city"
            textContentType="addressCity"
            returnKeyType="next"
            enableClearButton
            error={checkFieldError("city")}
            value={address.city}
            onChangeText={(e) => handleInputTextChange("city", e)}
            testID="input-city"
          />

          <Input
            ref={stateRef}
            title="State, Province, or Region"
            placeholder="Add state, province, or region"
            textContentType="addressState"
            returnKeyType="next"
            enableClearButton
            error={checkFieldError("state")}
            value={address.state}
            onChangeText={(e) => handleInputTextChange("state", e)}
            testID="input-state-province-region"
          />

          <Input
            ref={postalCodeRef}
            title="Postal code"
            placeholder="Add your postal code"
            textContentType="postalCode"
            returnKeyType="next"
            enableClearButton
            error={checkFieldError("postalCode")}
            value={address.postalCode}
            onChangeText={(e) => handleInputTextChange("postalCode", e)}
            testID="input-post-code"
          />

          <Input
            ref={phoneRef}
            title="Phone"
            placeholder="Add your phone number"
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            returnKeyType="next"
            enableClearButton
            error={checkFieldError("phoneNumber")}
            value={address.phoneNumber}
            onChangeText={(e) => handleInputTextChange("phoneNumber", e)}
            testID="input-phone"
          />

          <ScreenDimensionsContext.Consumer>
            {({ height }) => {
              const countryError = checkFieldError("country")

              return (
                <Flex mb={4}>
                  <CountrySelect
                    maxModalHeight={height * 0.95}
                    onSelectValue={(value: string) => handleCountrySelection(value)}
                    value={address.country.shortName}
                    hasError={!!countryError}
                  />
                  {!!countryError && (
                    <Sans size="2" mt="1" color="red100">
                      {countryError}
                    </Sans>
                  )}
                </Flex>
              )
            }}
          </ScreenDimensionsContext.Consumer>

          <Button block width={100} onPress={handleAddBillingAddressClick} testID="button-add">
            Add billing address
          </Button>
        </Stack>
      </ScrollView>
    </ArtsyKeyboardAvoidingView>
  )
}
