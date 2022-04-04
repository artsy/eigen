import { BottomAlignedButtonWrapper } from "app/Components/Buttons/BottomAlignedButtonWrapper"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import { Box, Button, Input, PhoneInput, Theme } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { ScrollView } from "react-native"
import { Schema, screenTrack, track } from "../../../utils/track"
import { Container } from "../Components/Containers"
interface PhoneNumberFormProps {
  onSubmit: (phone: string) => void
  navigator: NavigatorIOS
  phoneNumber?: string
}

screenTrack({
  context_screen: Schema.PageNames.BidFlowPhoneNumberPage,
  context_screen_owner_type: null,
})

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
        testID="button-add"
      >
        Add phone number
      </Button>
    </Box>
  )
  return (
    <BottomAlignedButtonWrapper buttonComponent={buttonComponent}>
      <Theme>
        <FancyModalHeader onLeftButtonPress={() => navigator?.pop()}>
          Add phone number
        </FancyModalHeader>
      </Theme>
      <ScrollView scrollEnabled={false}>
        <Container m={0}>
          <Box m="1" mt="3">
            <PhoneInput
              testID="phone-input"
              ref={phoneRef}
              value={enteredPhone}
              onChangeText={setEnteredPhone}
              setValidation={(valid) => {
                setIsValidNumber(valid)
              }}
            />
          </Box>
        </Container>
      </ScrollView>
    </BottomAlignedButtonWrapper>
  )
}
