import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import React from "react"
import { View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { TimeOffsetProvider } from "../Components/Bidding/Context/TimeOffsetProvider"
import { SelectMaxBidQueryRenderer } from "../Components/Bidding/Screens/SelectMaxBid"

export const BidFlow: React.FC<
  Omit<React.ComponentProps<typeof SelectMaxBidQueryRenderer>, "navigator">
> = (props) => {
  return (
    <View style={{ flex: 1, paddingTop: useSafeAreaInsets().top }}>
      <TimeOffsetProvider>
        <NavigatorIOS initialRoute={{ component: SelectMaxBidQueryRenderer, passProps: props }} />
      </TimeOffsetProvider>
    </View>
  )
}
