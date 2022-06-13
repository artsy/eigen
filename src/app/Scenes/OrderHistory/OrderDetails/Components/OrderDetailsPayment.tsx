import { OrderDetailsPayment_order$data } from "__generated__/OrderDetailsPayment_order.graphql"
import { Box, CreditCardIcon, Flex, Text, useSpace } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface OrderDetailsPaymentProps {
  order: OrderDetailsPayment_order$data
}

const CreditCardDetails: React.FC<OrderDetailsPaymentProps> = ({ order }) => {
  const space = useSpace()
  const creditCard = order.creditCard || null
  return (
    <Flex alignItems="center" flexDirection="row">
      <Flex>
        {creditCard ? (
          <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
            <Box flexGrow={1}>
              <CreditCardIcon
                type={creditCard?.brand as any}
                style={{ marginRight: space(1) }}
                width="17"
              />
            </Box>
            <Box flexGrow={2}>
              <Text variant="sm" color="black60" testID="credit-card-info">
                {creditCard?.brand} ending in {creditCard?.lastDigits}
              </Text>
            </Box>
          </Flex>
        ) : (
          <Text variant="sm" color="black60" testID="credit-card-null">
            N/A
          </Text>
        )}
      </Flex>
    </Flex>
  )
}

export const CreditCardSummaryItemFragmentContainer = createFragmentContainer(CreditCardDetails, {
  order: graphql`
    fragment OrderDetailsPayment_order on CommerceOrder {
      creditCard {
        brand
        lastDigits
      }
    }
  `,
})
