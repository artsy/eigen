import { Box, Button } from "@artsy/palette-mobile"
import { NavigationProp, RouteProp } from "@react-navigation/native"
import { BottomAlignedButtonWrapper } from "app/Components/Buttons/BottomAlignedButtonWrapper"
import { RegistrationFlowNavigationStackParams } from "app/Components/Containers/RegistrationFlow"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { Input } from "app/Components/Input"
import { PhoneInput } from "app/Components/Input/PhoneInput"
import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import { ProvideScreenTracking, Schema, track } from "app/utils/track"
import { PageNames } from "app/utils/track/schema"
import { useEffect, useRef, useState } from "react"
import { ScrollView } from "react-native"
interface PhoneNumberFormProps {
  navigator: NavigatorIOS

  navigation: NavigationProp<RegistrationFlowNavigationStackParams, "PhoneNumberForm">
  route: RouteProp<RegistrationFlowNavigationStackParams, "PhoneNumberForm">
}

export const PhoneNumberForm: React.FC<PhoneNumberFormProps> = (props) => {
  const { phoneNumber, onSubmit } = props.route.params

  const phoneRef = useRef<Input>(null)

  const [enteredPhone, setEnteredPhone] = useState<string>(phoneNumber || "")
  const [isValidNumber, setIsValidNumber] = useState<boolean>(false)

  useEffect(() => {
    phoneRef.current?.focus()
  }, [])

  const handleAddPhoneNumberClick = (): void => {
    onSubmit(enteredPhone)
    track({
      action_type: Schema.ActionTypes.Success,
      action_name: Schema.ActionNames.BidFlowSavePhoneNumber,
    })
    props.navigation.goBack()
  }

  const buttonComponent = (
    <Box pb={4} px={2}>
      <Button
        mt={4}
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
        <FancyModalHeader onLeftButtonPress={props.navigation.goBack}>
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
