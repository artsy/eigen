import { Screen } from "@artsy/palette-mobile"
import { TimeOffsetProvider } from "app/Components/Bidding/Context/TimeOffsetProvider"
import { BiddingNavigator } from "app/Navigation/AuthenticatedRoutes/BiddingNavigator"

export const RegistrationFlow: React.FC<{ saleID: string }> = (props) => {
  return (
    <Screen>
      <TimeOffsetProvider>
        <BiddingNavigator initialRouteName="RegisterToBid" {...props} />
      </TimeOffsetProvider>
    </Screen>
  )
}
