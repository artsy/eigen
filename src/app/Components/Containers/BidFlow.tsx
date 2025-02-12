import { Screen } from "@artsy/palette-mobile"
import { BidFlowContextProvider } from "app/Components/Bidding/Context/BidFlowContextProvider"
import { TimeOffsetProvider } from "app/Components/Bidding/Context/TimeOffsetProvider"
import {
  BiddingNavigationStackParams,
  BiddingNavigator,
} from "app/Navigation/AuthenticatedRoutes/BiddingNavigator"
import { SafeAreaView } from "react-native-safe-area-context"

export const BidFlow: React.FC<BiddingNavigationStackParams["SelectMaxBid"]> = (props) => {
  return (
    <Screen>
      <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
        <BidFlowContextProvider>
          <TimeOffsetProvider>
            <BiddingNavigator initialRouteName="SelectMaxBid" {...props} />
          </TimeOffsetProvider>
        </BidFlowContextProvider>
      </SafeAreaView>
    </Screen>
  )
}
