import React from "react"

import { CreditCardDetails_card } from "__generated__/CreditCardDetails_card.graphql"
import { bullet, CreditCardIcon, Flex, Sans } from "palette"
import { createFragmentContainer, graphql } from "react-relay"

const CreditCardDetails = ({
  card: { brand, lastDigits, expirationMonth, expirationYear },
}: {
  card: CreditCardDetails_card
}) => (
  <Flex alignItems="center" flexDirection="row">
    <CreditCardIcon type={brand as any} width={30} height={20} />
    <Flex flexDirection="row" alignItems="baseline">
      <Sans color="black100" size="4t" mx="1">
        {bullet}
        {bullet}
        {bullet}
        {bullet}
        {lastDigits}
      </Sans>
      <Sans color="black60" size="3t">
        Exp {expirationMonth.toString().padStart(2, "0")}/{expirationYear.toString().slice(-2)}
      </Sans>
    </Flex>
  </Flex>
)

export const CreditCardDetailsContainer = createFragmentContainer(CreditCardDetails, {
  card: graphql`
    fragment CreditCardDetails_card on CreditCard {
      brand
      lastDigits
      expirationMonth
      expirationYear
    }
  `,
})
