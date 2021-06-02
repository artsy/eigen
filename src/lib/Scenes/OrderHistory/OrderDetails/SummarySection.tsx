import { SummarySection_section } from "__generated__/SummarySection_section.graphql"
import { Flex, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  section: SummarySection_section
  testID?: string
}

export const SummarySection: React.FC<Props> = ({ section }) => {
  const { buyerTotal, taxTotal, shippingTotal, totalListPrice } = section

  return (
    <Flex flexDirection="row" justifyContent="space-between">
      <Flex>
        <Text variant="text">Price</Text>
        <Text variant="text" mt={1.5}>
          Shipping
        </Text>
        <Text variant="text">Tax</Text>
        <Text variant="mediumText" mt={1.5}>
          Total
        </Text>
      </Flex>
      <Flex alignItems="flex-end">
        <Text variant="text" color="black60" testID="totalListPrice">
          {totalListPrice}
        </Text>
        <Text variant="text" color="black60" mt={1.5} testID="shippingTotal">
          {shippingTotal}
        </Text>
        <Text variant="text" color="black60" testID="taxTotal">
          {taxTotal}
        </Text>
        <Text variant="mediumText" mt={1.5} testID="buyerTotal">
          {buyerTotal}
        </Text>
      </Flex>
    </Flex>
  )
}

export const SummarySectionFragmentContainer = createFragmentContainer(SummarySection, {
  section: graphql`
    fragment SummarySection_section on CommerceOrder {
      buyerTotal(precision: 2)
      taxTotal(precision: 2)
      shippingTotal(precision: 2)
      totalListPrice(precision: 2)
    }
  `,
})
