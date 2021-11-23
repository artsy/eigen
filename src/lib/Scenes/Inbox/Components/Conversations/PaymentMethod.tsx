import { PaymentMethod_order } from "__generated__/PaymentMethod_order.graphql"
import { track as _track } from "lib/utils/track"
import { Flex, Separator, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface PaymentMethodProps {
  order: PaymentMethod_order
}

export const PaymentMethod: React.FC<PaymentMethodProps> = ({ order }) => {
  if (!order.creditCard) {
    return null
  }

  const { lastDigits, expirationMonth, expirationYear } = order.creditCard
  const monthString = expirationMonth.toString()
  const month = monthString.length === 1 ? `0${expirationMonth}` : expirationMonth
  const year = expirationYear.toString().substring(2, 4)

  return (
    <>
      <Flex flexDirection="column" p={2}>
        <Text variant="md" mb={1} weight="medium">
          Payment Method
        </Text>
        <Text variant="sm" color="black60">
          {`•••• ${lastDigits} Exp ${month}/${year}`}
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
