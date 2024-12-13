import { Button, Flex, Input, InputRef, Text } from "@artsy/palette-mobile"
import { findCountryNameByCountryCode } from "app/Components/Bidding/Utils/findCountryNameByCountryCode"
import { validateAddressFieldsPresence } from "app/Components/Bidding/Validators/validateAddressFieldsPresence"
import { Address } from "app/Components/Bidding/types"
import { CountrySelect } from "app/Components/CountrySelect"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { Stack } from "app/Components/Stack"
import { ArtsyKeyboardAvoidingView } from "app/utils/ArtsyKeyboardAvoidingView"
import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import { ScreenDimensionsContext } from "app/utils/hooks"
import { Schema, screenTrack, track } from "app/utils/track"
import React, { useEffect, useRef, useState } from "react"
import { ScrollView } from "react-native"

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

  const fullNameRef = useRef<InputRef>(null)
  const addressLine1Ref = useRef<InputRef>(null)
  const addressLine2Ref = useRef<InputRef>(null)
  const cityRef = useRef<InputRef>(null)
  const stateRef = useRef<InputRef>(null)
  const postalCodeRef = useRef<InputRef>(null)
  const phoneRef = useRef<InputRef>(null)

  const [address, setAddress] = useState<Address>({
    fullName: billingAddress?.fullName || "",
    addressLine1: billingAddress?.addressLine1 || "",
    addressLine2: billingAddress?.addressLine2 || "",
    city: billingAddress?.city || "",
    state: billingAddress?.state || "",
    country: {
      longName: billingAddress?.country.longName || "",
      shortName: billingAddress?.country.shortName || "",
    },
    postalCode: billingAddress?.postalCode || "",
    phoneNumber: billingAddress?.phoneNumber || "",
  })

  const [addressFieldsWithError, setAddressFieldsWithError] = useState<string[]>([])

  // focus on the initial input on mount
  useEffect(() => {
    fullNameRef.current?.focus()
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
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 50 }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <Stack spacing={2}>
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
            onSubmitEditing={() => addressLine1Ref.current?.focus()}
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
            onSubmitEditing={() => addressLine2Ref.current?.focus()}
          />

          <Input
            ref={addressLine2Ref}
            title="Address line 2"
            optional
            placeholder={[
              "Add your apt, floor, suite, etc.",
              "Add your apt, floor, etc.",
              "Add your apt, etc.",
            ]}
            textContentType="streetAddressLine2"
            returnKeyType="next"
            enableClearButton
            value={address.addressLine2}
            onChangeText={(e) => handleInputTextChange("addressLine2", e)}
            testID="input-address-2"
            onSubmitEditing={() => cityRef.current?.focus()}
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
            onSubmitEditing={() => stateRef.current?.focus()}
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
            onSubmitEditing={() => postalCodeRef.current?.focus()}
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
            onSubmitEditing={() => phoneRef.current?.focus()}
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
            {() => {
              const countryError = checkFieldError("country")

              return (
                <Flex mb={4} mt={2}>
                  <CountrySelect
                    onSelectValue={(value: string) => handleCountrySelection(value)}
                    value={address.country.shortName}
                    hasError={!!countryError}
                  />
                  {!!countryError && (
                    <Text variant="xs" mt={1} color="red100">
                      {countryError}
                    </Text>
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
