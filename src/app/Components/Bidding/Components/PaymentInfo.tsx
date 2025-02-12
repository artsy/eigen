import { bullet } from "@artsy/palette-mobile"
import { NavigationProp } from "@react-navigation/native"
import { Token } from "@stripe/stripe-react-native"
import { Card } from "@stripe/stripe-react-native/lib/typescript/src/types/Token"
import { FlexProps } from "app/Components/Bidding/Elements/Flex"
import { Address, PaymentCardTextFieldParams } from "app/Components/Bidding/types"
import { BiddingNavigationStackParams } from "app/Navigation/AuthenticatedRoutes/BiddingNavigator"
import React from "react"
import { View } from "react-native"
import { BidInfoRow } from "./BidInfoRow"
import { Divider } from "./Divider"

interface PaymentInfoProps extends FlexProps {
  navigator?: NavigationProp<BiddingNavigationStackParams, "ConfirmBid" | "RegisterToBid">
  onCreditCardAdded: (t: Token.Result, a: Address) => void
  billingAddress?: Address | null
  creditCardFormParams?: PaymentCardTextFieldParams | null
  creditCardToken?: Token.Result | null
}

export class PaymentInfo extends React.Component<PaymentInfoProps> {
  constructor(props: PaymentInfoProps) {
    super(props)
  }

  presentCreditCardForm() {
    this.props.navigator?.navigate("CreditCardForm", {
      onSubmit: (token: Token.Result, address: Address) => this.onCreditCardAdded(token, address),
      billingAddress: this.props.billingAddress,
    })
  }

  onCreditCardAdded(token: Token.Result, address: Address) {
    this.props.onCreditCardAdded(token, address)
  }

  render() {
    const { creditCardToken: token } = this.props

    return (
      <View>
        <Divider />

        <BidInfoRow
          label="Credit card"
          value={token?.card ? this.formatCard(token.card) : ""}
          onPress={() => this.presentCreditCardForm()}
        />

        <Divider />
      </View>
    )
  }

  private formatCard(card: Card) {
    return `${card.brand} ${bullet}${bullet}${bullet}${bullet} ${card.last4}`
  }
}
