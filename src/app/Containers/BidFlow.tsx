import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import { View } from "react-native"
import { TimeOffsetProvider } from "../Components/Bidding/Context/TimeOffsetProvider"
import { SelectMaxBidQueryRenderer } from "../Components/Bidding/Screens/SelectMaxBid"

export const BidFlow: React.FC<
  Omit<React.ComponentProps<typeof SelectMaxBidQueryRenderer>, "navigator">
> = (props) => {
  return (
    <View style={{ flex: 1 }}>
      <TimeOffsetProvider>
        <NavigatorIOS initialRoute={{ component: SelectMaxBidQueryRenderer, passProps: props }} />
      </TimeOffsetProvider>
    </View>
  )
}
