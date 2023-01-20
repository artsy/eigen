import { Box, Flex, Text } from "palette"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

import { Bid } from "app/Components/Bidding/types"
import { defaultEnvironment } from "app/system/relay/createEnvironment"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"

import { PriceSummary_calculatedCost$data } from "__generated__/PriceSummary_calculatedCost.graphql"
import { PriceSummaryQuery } from "__generated__/PriceSummaryQuery.graphql"

interface PriceSummaryViewProps {
  calculatedCost: PriceSummary_calculatedCost$data
  bid: Bid
}

const _PriceSummary = ({ bid, calculatedCost }: PriceSummaryViewProps) => (
  <Box mx={4}>
    <Text variant="sm-display" mb={1} weight="medium" color="black100">
      Summary
    </Text>

    <Flex mb={1} flexDirection="row" justifyContent="space-between">
      <Text variant="sm" color="black100">
        Your max bid
      </Text>
      <Text variant="sm" color="black100">
        {`${bid.display}.00`}
      </Text>
    </Flex>

    <Flex mb={1} flexDirection="row" justifyContent="space-between">
      <Text variant="sm" color="black100">
        Buyer’s premium
      </Text>
      <Text variant="sm" color="black100">
        {calculatedCost.buyersPremium! /* STRICTNESS_MIGRATION */.display}
      </Text>
    </Flex>

    <Flex mb={1} flexDirection="row" justifyContent="space-between">
      <Text variant="sm" color="black100">
        Subtotal
      </Text>
      <Text variant="sm" color="black100">
        {calculatedCost.subtotal! /* STRICTNESS_MIGRATION */.display}
      </Text>
    </Flex>

    <Text variant="sm" color="black60">
      Plus any applicable shipping, taxes, and fees.
    </Text>
  </Box>
)

const PriceSummaryFragmentContainer = createFragmentContainer(_PriceSummary, {
  calculatedCost: graphql`
    fragment PriceSummary_calculatedCost on CalculatedCost {
      buyersPremium {
        display
      }
      subtotal {
        display
      }
    }
  `,
})

interface PriceSummaryProps extends Partial<PriceSummaryQuery["variables"]> {
  bid: Bid
}

export const PriceSummary = ({ saleArtworkId, bid }: PriceSummaryProps) => (
  <QueryRenderer<PriceSummaryQuery>
    environment={defaultEnvironment}
    query={graphql`
      query PriceSummaryQuery($saleArtworkId: ID!, $bidAmountMinor: Int!) {
        node(id: $saleArtworkId) {
          ... on SaleArtwork {
            calculatedCost(bidAmountMinor: $bidAmountMinor) {
              ...PriceSummary_calculatedCost
            }
          }
        }
      }
    `}
    variables={{
      saleArtworkId: saleArtworkId!,
      bidAmountMinor: bid.cents,
    }}
    render={renderWithLoadProgress<PriceSummaryQuery["response"]>(({ node }) => (
      <PriceSummaryFragmentContainer bid={bid} calculatedCost={node?.calculatedCost!} />
    ))}
  />
)
