import { ArtsyKeyboardAvoidingView } from "app/Components/ArtsyKeyboardAvoidingView"
import { CountrySelect } from "app/Components/CountrySelect"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { Stack } from "app/Components/Stack"
import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import { ScreenDimensionsContext } from "app/utils/useScreenDimensions"
import { Button, Flex, Input, PhoneInput, Sans, Theme } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { ScrollView } from "react-native"
import { Schema, screenTrack, track } from "../../../utils/track"
import { Address } from "../types"
import { findCountryNameByCountryCode } from "../Utils/findCountryNameByCountryCode"
import { validateAddressFieldsPresence } from "../Validators/validateAddressFieldsPresence"
import { propsStore } from "app/store/PropsStore"

interface PhoneNumberProps {
  onSubmit: (phone: string) => void
  navigator: NavigatorIOS
  phoneNumber?: string
}

screenTrack({
  context_screen: Schema.PageNames.BidFlowPhoneNumberPage,
  context_screen_owner_type: null,
})

// WIP: ADAPTING FROM BILLINGADDRESS.TSX

export const PhoneNumber: React.FC<PhoneNumberProps> = (props) => {
  const { onSubmit, navigator, phoneNumber } = props
  /**
   *
   */
  const scrollViewRef = useRef<ScrollView>(null)

  const phoneRef = useRef<Input>(null)

  const [enteredPhone, setEnteredPhone] = useState<string>(phoneNumber || "")
  const [isValidNumber, setIsValidNumber] = useState<boolean>(false)
  // const [submitting, setSubmitting] = useState<boolean>(false)

  // focus on the initial input on mount
  useEffect(() => {
    phoneRef.current?.focus()
  }, [])

  // validates required fields & submits address
  const handleAddPhoneNumberClick = (): void => {
    // setSubmitting(true)
    onSubmit(enteredPhone)
    // setSubmitting(false)
    navigator?.pop()
    track({
      action_type: Schema.ActionTypes.Success,
      action_name: Schema.ActionNames.BidFlowSavePhoneNumber,
    })
  }

  return (
    <ArtsyKeyboardAvoidingView>
      <Theme>
        <FancyModalHeader onLeftButtonPress={() => navigator?.pop()}>
          Add billing address
        </FancyModalHeader>
      </Theme>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ padding: 20, paddingBottom: 50 }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <Stack spacing={3}>
          <PhoneInput
            ref={phoneRef}
            value={enteredPhone}
            onChangeText={setEnteredPhone}
            setValidation={(valid) => {
              setIsValidNumber(valid)
            }}
          />

          <Button
            block
            disabled={!isValidNumber}
            width={100}
            onPress={handleAddPhoneNumberClick}
            testID="button-add"
          >
            Add phone number
          </Button>
        </Stack>
      </ScrollView>
    </ArtsyKeyboardAvoidingView>
  )
}
