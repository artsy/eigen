import { NavigationProp } from "@react-navigation/native"
import { FlexProps } from "app/Components/Bidding/Elements/Flex"
import { RegistrationFlowNavigationStackParams } from "app/Components/Containers/RegistrationFlow"
import { View } from "react-native"

import { BidInfoRow } from "./BidInfoRow"
import { Divider } from "./Divider"

interface PhoneInfoProps extends FlexProps {
  navigation: NavigationProp<RegistrationFlowNavigationStackParams, "RegisterToBid">
  onPhoneAdded: (phoneNumber: string) => void
  phoneNumber?: string
}

export const PhoneInfo: React.FC<PhoneInfoProps> = (props) => {
  const presentPhoneForm = (): void => {
    props.navigation.navigate("PhoneNumberForm", {
      onSubmit: (phone: string) => props.onPhoneAdded(phone),
      phoneNumber: props.phoneNumber,
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
