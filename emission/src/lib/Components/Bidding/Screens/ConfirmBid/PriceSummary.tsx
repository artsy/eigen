import { Box, Flex, Sans, Serif } from "@artsy/palette"
import React from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

import { Bid } from "lib/Components/Bidding/types"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"

import { PriceSummary_calculatedCost } from "__generated__/PriceSummary_calculatedCost.graphql"
import { PriceSummaryQuery, PriceSummaryQueryVariables } from "__generated__/PriceSummaryQuery.graphql"

interface PriceSummaryViewProps {
  calculatedCost: PriceSummary_calculatedCost
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
        {calculatedCost.buyersPremium.display}
      </Sans>
    </Flex>

    <Flex mb={1} flexDirection="row" justifyContent="space-between">
      <Sans size="3" color="black100">
        Subtotal
      </Sans>
      <Sans size="3" color="black100">
        {calculatedCost.subtotal.display}
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

interface PriceSummaryProps extends Partial<PriceSummaryQueryVariables> {
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
      saleArtworkId,
      bidAmountMinor: bid.cents,
    }}
    render={renderWithLoadProgress(({ node }) => (
      <PriceSummaryFragmentContainer bid={bid} {...node} />
    ))}
  />
)
