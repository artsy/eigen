import { bullet } from "@artsy/palette-mobile"
import { NavigationProp } from "@react-navigation/native"
import { Token } from "@stripe/stripe-react-native"
import { Card } from "@stripe/stripe-react-native/lib/typescript/src/types/Token"
import { FlexProps } from "app/Components/Bidding/Elements/Flex"
import { Address, PaymentCardTextFieldParams } from "app/Components/Bidding/types"
import { BidFlowNavigationStackParams } from "app/Components/Containers/BidFlow"
import { RegistrationFlowNavigationStackParams } from "app/Components/Containers/RegistrationFlow"
import React from "react"
import { View } from "react-native"

import { BidInfoRow } from "./BidInfoRow"
import { Divider } from "./Divider"

interface PaymentInfoProps extends FlexProps {
  navigation:
    | NavigationProp<RegistrationFlowNavigationStackParams, "RegisterToBid">
    | NavigationProp<BidFlowNavigationStackParams, "SelectMaxBid">
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
    // Typescript failed to tell that the screen name is the same for both stacks
    // @ts-expect-error
    this.props.navigation.navigate("CreditCardForm", {
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
