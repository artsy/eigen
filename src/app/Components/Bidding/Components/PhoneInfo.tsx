import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import React from "react"
import { View } from "react-native"

import { BidInfoRow } from "./BidInfoRow"
import { Divider } from "./Divider"

import { FlexProps } from "../Elements/Flex"
import { PhoneNumberForm } from "../Screens/PhoneNumberForm"

interface PhoneInfoProps extends FlexProps {
  navigator: NavigatorIOS
  onPhoneAdded: (phoneNumber: string) => void
  phoneNumber?: string
}

export const PhoneInfo: React.FC<PhoneInfoProps> = (props) => {
  const presentPhoneForm = (): void => {
    props.navigator.push({
      component: PhoneNumberForm,
      title: "",
      passProps: {
        onSubmit: (phone: string) => props.onPhoneAdded(phone),
        billingAddress: props.phoneNumber,
        navigator: props.navigator,
      },
    })
  }

  return (
    <View>
      <Divider />

      <BidInfoRow
        label="Phone number"
        value={props.phoneNumber || ""}
        onPress={() => presentPhoneForm()}
      />

      <Divider />
    </View>
  )
}
