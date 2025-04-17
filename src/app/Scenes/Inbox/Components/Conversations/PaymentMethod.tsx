import { Flex, Text, Separator } from "@artsy/palette-mobile"
import { PaymentMethod_order$data } from "__generated__/PaymentMethod_order.graphql"
import { createFragmentContainer, graphql } from "react-relay"

interface PaymentMethodProps {
  order: PaymentMethod_order$data
}

export const PaymentMethod: React.FC<PaymentMethodProps> = ({ order }) => {
  if (!order.creditCard) {
    return null
  }

  const { lastDigits, expirationMonth, expirationYear } = order.creditCard

  return (
    <>
      <Flex flexDirection="column" p={2}>
        <Text variant="sm-display" mb={1} weight="medium">
          Payment Method
        </Text>
        <Text variant="sm" color="mono60">
          {`•••• ${lastDigits} Exp ${expirationMonth.toString().padStart(2, "0")}/${expirationYear
            .toString()
            .slice(-2)}`}
        </Text>
      </Flex>
      <Separator />
    </>
  )
}

export const PaymentMethodFragmentContainer = createFragmentContainer(PaymentMethod, {
  order: graphql`
    fragment PaymentMethod_order on CommerceOrder {
      creditCard {
        lastDigits
        expirationMonth
        expirationYear
      }
    }
  `,
})
