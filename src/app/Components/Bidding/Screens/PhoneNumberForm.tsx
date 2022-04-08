import { BottomAlignedButtonWrapper } from "app/Components/Buttons/BottomAlignedButtonWrapper"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import { PageNames } from "app/utils/track/schema"
import { Box, Button, Input, PhoneInput } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { ScrollView } from "react-native"
import { ProvideScreenTracking, Schema, track } from "../../../utils/track"
interface PhoneNumberFormProps {
  onSubmit: (phone: string) => void
  navigator: NavigatorIOS
  phoneNumber?: string
}

export const PhoneNumberForm: React.FC<PhoneNumberFormProps> = (props) => {
  const { onSubmit, navigator, phoneNumber } = props

  const phoneRef = useRef<Input>(null)

  const [enteredPhone, setEnteredPhone] = useState<string>(phoneNumber || "")
  const [isValidNumber, setIsValidNumber] = useState<boolean>(false)

  useEffect(() => {
    phoneRef.current?.focus()
  }, [])

  const handleAddPhoneNumberClick = (): void => {
    onSubmit(enteredPhone)
    navigator?.pop()
    track({
      action_type: Schema.ActionTypes.Success,
      action_name: Schema.ActionNames.BidFlowSavePhoneNumber,
    })
  }

  const buttonComponent = (
    <Box m="4">
      <Button
        mt={3}
        block
        disabled={!isValidNumber}
        width={100}
        onPress={() => {
          handleAddPhoneNumberClick()
        }}
      >
        Add phone number
      </Button>
    </Box>
  )
  return (
    <ProvideScreenTracking
      info={{
        context_screen: PageNames.ArtistSeriesPage,
        context_screen_owner_type: null,
      }}
    >
      <BottomAlignedButtonWrapper buttonComponent={buttonComponent}>
        <FancyModalHeader onLeftButtonPress={() => navigator?.pop()}>
          Add phone number
        </FancyModalHeader>
        <ScrollView
          scrollEnabled={false}
          contentContainerStyle={{ marginHorizontal: 20, marginTop: 10 }}
        >
          <PhoneInput
            testID="phone-input"
            ref={phoneRef}
            value={enteredPhone}
            onChangeText={setEnteredPhone}
            setValidation={(valid) => {
              setIsValidNumber(valid)
            }}
          />
        </ScrollView>
      </BottomAlignedButtonWrapper>
    </ProvideScreenTracking>
  )
}
