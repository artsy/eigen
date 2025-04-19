import { useColor } from "@artsy/palette-mobile"
import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Token } from "@stripe/stripe-react-native"
import { BidResult_saleArtwork$key } from "__generated__/BidResult_saleArtwork.graphql"
import { ConfirmBid_me$key } from "__generated__/ConfirmBid_me.graphql"
import { ConfirmBid_saleArtwork$key } from "__generated__/ConfirmBid_saleArtwork.graphql"
import { BidResult } from "app/Components/Bidding/Screens/BidResult"
import { BidderPositionResult, ConfirmBid } from "app/Components/Bidding/Screens/ConfirmBid"
import { CreditCardForm } from "app/Components/Bidding/Screens/CreditCardForm"
import { PhoneNumberForm } from "app/Components/Bidding/Screens/PhoneNumberForm"
import { RegistrationQueryRenderer } from "app/Components/Bidding/Screens/Registration"
import {
  RegistrationResult,
  RegistrationStatus,
} from "app/Components/Bidding/Screens/RegistrationResult"
import { SelectMaxBidQueryRenderer } from "app/Components/Bidding/Screens/SelectMaxBid"
import { Address } from "app/Components/Bidding/types"

export type BiddingNavigationStackParams = {
  RegisterToBid: { saleID: string }
  SelectMaxBid: { artworkID: string; saleID: string }
  PhoneNumberForm: { onSubmit: (phoneNumber: string) => void; phoneNumber?: string }
  CreditCardForm: {
    onSubmit: (t: Token.Result, a: Address) => void
    billingAddress?: Address | null
  }
  ConfirmBid: {
    saleArtwork: ConfirmBid_saleArtwork$key
    me: ConfirmBid_me$key
    refreshSaleArtwork?: () => void
  }
  BidResult: {
    saleArtwork: BidResult_saleArtwork$key
    bidderPositionResult: NonNullable<BidderPositionResult>
    refreshBidderInfo?: () => void
    refreshSaleArtwork?: () => void
  }
  RegistrationResult: {
    status: RegistrationStatus
    needsIdentityVerification?: boolean
  }
}

const BiddingNavigationStack = createNativeStackNavigator<BiddingNavigationStackParams>()

type BiddingNavigatorProps =
  | {
      initialRouteName: "RegisterToBid"
      saleID: string
    }
  | {
      initialRouteName: "SelectMaxBid"
      artworkID: string
      saleID: string
    }

export const BiddingNavigator: React.FC<BiddingNavigatorProps> = (props) => {
  const color = useColor()

  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <BiddingNavigationStack.Navigator
          screenOptions={{
            headerShown: false,
            gestureEnabled: false,
            contentStyle: { flex: 1, backgroundColor: color("mono0") },
          }}
          initialRouteName={props.initialRouteName}
        >
          <BiddingNavigationStack.Screen
            name="RegisterToBid"
            component={RegistrationQueryRenderer}
            initialParams={props}
          />
          <BiddingNavigationStack.Screen
            name="SelectMaxBid"
            component={SelectMaxBidQueryRenderer}
            initialParams={props}
          />
          <BiddingNavigationStack.Screen name="PhoneNumberForm" component={PhoneNumberForm} />
          <BiddingNavigationStack.Screen name="CreditCardForm" component={CreditCardForm} />
          <BiddingNavigationStack.Screen name="ConfirmBid" component={ConfirmBid} />
          <BiddingNavigationStack.Screen name="BidResult" component={BidResult} />
          <BiddingNavigationStack.Screen name="RegistrationResult" component={RegistrationResult} />
        </BiddingNavigationStack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  )
}
