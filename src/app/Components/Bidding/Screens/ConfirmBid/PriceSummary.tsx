import { Box, Flex, Sans, Serif } from "palette"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

import { Bid } from "app/Components/Bidding/types"
import { defaultEnvironment } from "app/relay/createEnvironment"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"

import { PriceSummary_calculatedCost$data } from "__generated__/PriceSummary_calculatedCost.graphql"
import { PriceSummaryQuery } from "__generated__/PriceSummaryQuery.graphql"

interface PriceSummaryViewProps {
  calculatedCost: PriceSummary_calculatedCost$data
  bid: Bid
}

const _PriceSummary = ({ bid, calculatedCost }: PriceSummaryViewProps) => (
  <Box mx={4}>
    <Serif mb={1} size="4" weight="semibold" color="black100">
      Summary
    </Serif>

    <Flex mb={1} flexDirection="row" justifyContent="space-between">
      <Sans size="3" color="black100">
        Your max bid
      </Sans>
      <Sans size="3" color="black100">
        {`${bid.display}.00`}
      </Sans>
    </Flex>

    <Flex mb={1} flexDirection="row" justifyContent="space-between">
      <Sans size="3" color="black100">
        Buyer’s premium
      </Sans>
      <Sans size="3" color="black100">
        {calculatedCost.buyersPremium! /* STRICTNESS_MIGRATION */.display}
      </Sans>
    </Flex>

    <Flex mb={1} flexDirection="row" justifyContent="space-between">
      <Sans size="3" color="black100">
        Subtotal
      </Sans>
      <Sans size="3" color="black100">
        {calculatedCost.subtotal! /* STRICTNESS_MIGRATION */.display}
      </Sans>
    </Flex>

    <Sans size="3" color="black60">
      Plus any applicable shipping, taxes, and fees.
    </Sans>
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
