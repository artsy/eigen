import { Flex, Text, Button, Input2Ref, Input2 } from "@artsy/palette-mobile"
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

  const fullNameRef = useRef<Input2Ref>(null)
  const addressLine1Ref = useRef<Input2Ref>(null)
  const addressLine2Ref = useRef<Input2Ref>(null)
  const cityRef = useRef<Input2Ref>(null)
  const stateRef = useRef<Input2Ref>(null)
  const postalCodeRef = useRef<Input2Ref>(null)
  const phoneRef = useRef<Input2Ref>(null)

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
        contentContainerStyle={{ padding: 20, paddingBottom: 50 }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <Stack spacing={4}>
          <Input2
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

          <Input2
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

          <Input2
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

          <Input2
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

          <Input2
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

          <Input2
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

          <Input2
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
