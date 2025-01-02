import { Flex, Screen } from "@artsy/palette-mobile"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Token } from "@stripe/stripe-react-native"
import { BidResult_sale_artwork$data } from "__generated__/BidResult_sale_artwork.graphql"
import { TimeOffsetProvider } from "app/Components/Bidding/Context/TimeOffsetProvider"
import { BidResultScreen } from "app/Components/Bidding/Screens/BidResult"
import {
  BidderPositionResult,
  ConfirmBidScreenQueryRenderer,
} from "app/Components/Bidding/Screens/ConfirmBid"
import { CreditCardForm } from "app/Components/Bidding/Screens/CreditCardForm"
import { PhoneNumberForm } from "app/Components/Bidding/Screens/PhoneNumberForm"
import {
  RegistrationResult,
  RegistrationStatus,
} from "app/Components/Bidding/Screens/RegistrationResult"
import { SelectMaxBidQueryRenderer } from "app/Components/Bidding/Screens/SelectMaxBid"
import { Address } from "app/Components/Bidding/types"

export type BidFlowNavigationStackParams = {
  SelectMaxBid: { artworkID: string; saleID: string }
  PhoneNumberForm: {
    onSubmit: (phoneNumber: string) => void
    phoneNumber: string | undefined
  }
  CreditCardForm: {
    onSubmit: (t: Token.Result, a: Address) => void
    billingAddress?: Address | null
  }
  ConfirmBid: {
    sale_artwork: any
    me: any
    increments: any
    selectedBidIndex: number
    refreshSaleArtwork?: () => void
    artworkID: string
    saleID: string
  }
  BidResult: {
    sale_artwork: BidResult_sale_artwork$data
    bidderPositionResult: BidderPositionResult
    refreshBidderInfo?: () => void
    refreshSaleArtwork?: () => void
    biddingEndAt?: string | null
  }
  RegistrationResult: {
    needsIdentityVerification: boolean
    status: RegistrationStatus
  }
}

const BidFlowNavigationStack = createNativeStackNavigator<BidFlowNavigationStackParams>()

export const BidFlow: React.FC<{ artworkID: string; saleID: string }> = (props) => {
  return (
    <Screen>
      <Flex flex={1}>
        <TimeOffsetProvider>
          <NavigationContainer independent>
            <BidFlowNavigationStack.Navigator
              screenOptions={{
                headerShown: false,
                gestureEnabled: false,
                contentStyle: {
                  flex: 1,
                  backgroundColor: "white",
                },
              }}
            >
              <BidFlowNavigationStack.Screen
                name="SelectMaxBid"
                component={SelectMaxBidQueryRenderer}
                initialParams={props}
              />
              <BidFlowNavigationStack.Screen name="PhoneNumberForm" component={PhoneNumberForm} />
              <BidFlowNavigationStack.Screen name="CreditCardForm" component={CreditCardForm} />
              <BidFlowNavigationStack.Screen
                name="ConfirmBid"
                component={ConfirmBidScreenQueryRenderer}
                initialParams={props}
              />
              <BidFlowNavigationStack.Screen name="BidResult" component={BidResultScreen} />
              <BidFlowNavigationStack.Screen
                name="RegistrationResult"
                component={RegistrationResult}
              />
            </BidFlowNavigationStack.Navigator>
          </NavigationContainer>
        </TimeOffsetProvider>
      </Flex>
    </Screen>
  )
}
