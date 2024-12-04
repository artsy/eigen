import { Flex, Screen } from "@artsy/palette-mobile"
import { TimeOffsetProvider } from "app/Components/Bidding/Context/TimeOffsetProvider"
import { SelectMaxBidQueryRenderer } from "app/Components/Bidding/Screens/SelectMaxBid"
import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"

export const BidFlow: React.FC<
  Omit<React.ComponentProps<typeof SelectMaxBidQueryRenderer>, "navigator">
> = (props) => {
  return (
    <Screen>
      <Flex flex={1}>
        <TimeOffsetProvider>
          <NavigatorIOS initialRoute={{ component: SelectMaxBidQueryRenderer, passProps: props }} />
        </TimeOffsetProvider>
      </Flex>
    </Screen>
  )
}
