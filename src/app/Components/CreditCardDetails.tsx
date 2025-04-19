import { bullet, CreditCardIcon, Flex, Text } from "@artsy/palette-mobile"
import { CreditCardDetails_card$data } from "__generated__/CreditCardDetails_card.graphql"
import { createFragmentContainer, graphql } from "react-relay"

const CreditCardDetails = ({
  card: { brand, lastDigits, expirationMonth, expirationYear },
}: {
  card: CreditCardDetails_card$data
}) => (
  <Flex alignItems="center" flexDirection="row">
    <CreditCardIcon type={brand as any} width={30} height={20} />
    <Flex flexDirection="row" alignItems="baseline">
      <Text variant="sm-display" color="mono100" mx={1}>
        {bullet}
        {bullet}
        {bullet}
        {bullet}
        {lastDigits}
      </Text>
      <Text variant="sm" color="mono60">
        Exp {expirationMonth.toString().padStart(2, "0")}/{expirationYear.toString().slice(-2)}
      </Text>
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
