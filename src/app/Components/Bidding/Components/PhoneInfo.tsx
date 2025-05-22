import { NavigationProp } from "@react-navigation/native"
import { FlexProps } from "app/Components/Bidding/Elements/Flex"
import { BiddingNavigationStackParams } from "app/Navigation/AuthenticatedRoutes/BiddingNavigator"
import { View } from "react-native"

import { BidInfoRow } from "./BidInfoRow"
import { Divider } from "./Divider"

interface PhoneInfoProps extends FlexProps {
  navigator: NavigationProp<BiddingNavigationStackParams, "RegisterToBid">
  onPhoneAdded: (phoneNumber: string) => void
  phoneNumber?: string
}

export const PhoneInfo: React.FC<PhoneInfoProps> = (props) => {
  const presentPhoneForm = (): void => {
    props.navigator.navigate("PhoneNumberForm", {
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
