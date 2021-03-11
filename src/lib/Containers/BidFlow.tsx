import { ModalHeader } from "lib/Components/ModalHeader"
import NavigatorIOS from "lib/utils/__legacy_do_not_use__navigator-ios-shim"
import React from "react"
import { Platform } from "react-native"
import { TimeOffsetProvider } from "../Components/Bidding/Context/TimeOffsetProvider"
import { SelectMaxBidQueryRenderer } from "../Components/Bidding/Screens/SelectMaxBid"

export const BidFlow: React.FC<Omit<React.ComponentProps<typeof SelectMaxBidQueryRenderer>, "navigator">> = (props) => {
  return (
    <TimeOffsetProvider>
      <NavigatorIOS initialRoute={{ component: SelectMaxBidQueryRenderer, passProps: props }} />
      {Platform.OS === "ios" ? null : <ModalHeader />}
    </TimeOffsetProvider>
  )
}
