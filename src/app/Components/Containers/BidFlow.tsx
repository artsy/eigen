import { Screen } from "@artsy/palette-mobile"
import { BidFlowContextProvider } from "app/Components/Bidding/Context/BidFlowContextProvider"
import { TimeOffsetProvider } from "app/Components/Bidding/Context/TimeOffsetProvider"
import { SelectMaxBidQueryRenderer } from "app/Components/Bidding/Screens/SelectMaxBid"
import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import { SafeAreaView } from "react-native-safe-area-context"

export const BidFlow: React.FC<
  Omit<React.ComponentProps<typeof SelectMaxBidQueryRenderer>, "navigator">
> = (props) => {
  return (
    <Screen>
      <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
        <BidFlowContextProvider>
          <TimeOffsetProvider>
            <NavigatorIOS
              initialRoute={{ component: SelectMaxBidQueryRenderer, passProps: props }}
            />
          </TimeOffsetProvider>
        </BidFlowContextProvider>
      </SafeAreaView>
    </Screen>
  )
}
