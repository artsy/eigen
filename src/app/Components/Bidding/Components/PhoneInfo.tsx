import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import React from "react"
import { View } from "react-native"

import { BidInfoRow } from "./BidInfoRow"
import { Divider } from "./Divider"

import { FlexProps } from "../Elements/Flex"
import { PhoneNumberForm } from "../Screens/PhoneNumberForm"

interface PhoneInfoProps extends FlexProps {
  navigator?: NavigatorIOS
  onPhoneAdded: (phoneNumber: string) => void
  phoneNumber?: string
}

export class PhoneInfo extends React.Component<PhoneInfoProps> {
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  constructor(props) {
    super(props)
  }

  presentPhoneForm() {
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    this.props.navigator.push({
      component: PhoneNumberForm,
      title: "",
      passProps: {
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        onSubmit: (phone) => this.props.onPhoneAdded(phone),
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
          // x @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          value={this.props.phoneNumber || ""}
          onPress={() => this.presentPhoneForm()}
        />

        <Divider />
      </View>
    )
  }
}
