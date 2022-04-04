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

export class PhoneInfo extends React.Component<PhoneInfoProps> {
  constructor(props: PhoneInfoProps) {
    super(props)
  }

  presentPhoneForm() {
    this.props.navigator.push({
      component: PhoneNumberForm,
      title: "",
      passProps: {
        onSubmit: (phone: string) => this.props.onPhoneAdded(phone),
        billingAddress: this.props.phoneNumber,
        navigator: this.props.navigator,
      },
    })
  }

  render() {
    return (
      <View>
        <Divider />

        <BidInfoRow
          label="Phone number"
          value={this.props.phoneNumber || ""}
          onPress={() => this.presentPhoneForm()}
        />

        <Divider />
      </View>
    )
  }
}
