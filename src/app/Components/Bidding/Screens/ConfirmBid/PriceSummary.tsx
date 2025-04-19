import { Box, Flex, Text } from "@artsy/palette-mobile"
import { PriceSummaryQuery } from "__generated__/PriceSummaryQuery.graphql"
import { PriceSummary_calculatedCost$key } from "__generated__/PriceSummary_calculatedCost.graphql"
import { BidFlowContextStore } from "app/Components/Bidding/Context/BidFlowContextProvider"
import { NoFallback, SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface PriceSummaryProps {
  calculatedCost: PriceSummary_calculatedCost$key
}

const PriceSummary_: React.FC<PriceSummaryProps> = ({ calculatedCost }) => {
  const selectedBid = BidFlowContextStore.useStoreState((state) => state.selectedBid)
  const { subtotal, buyersPremium } = useFragment(priceSummaryFragment, calculatedCost)

  if (!subtotal || !buyersPremium) {
    return null
  }

  return (
    <Box mx={4}>
      <Text variant="sm-display" mb={1} weight="medium" color="mono100">
        Summary
      </Text>

      <Flex mb={1} flexDirection="row" justifyContent="space-between">
        <Text variant="sm" color="mono100">
          Your max bid
        </Text>
        <Text variant="sm" color="mono100">
          {`${selectedBid.display}.00`}
        </Text>
      </Flex>

      <Flex mb={1} flexDirection="row" justifyContent="space-between">
        <Text variant="sm" color="mono100">
          Buyer’s premium
        </Text>
        <Text variant="sm" color="mono100">
          {buyersPremium.display}
        </Text>
      </Flex>

      <Flex mb={1} flexDirection="row" justifyContent="space-between">
        <Text variant="sm" color="mono100">
          Subtotal
        </Text>
        <Text variant="sm" color="mono100">
          {subtotal.display}
        </Text>
      </Flex>

      <Text variant="sm" color="mono60">
        Plus any applicable shipping, taxes, and fees.
      </Text>
    </Box>
  )
}

interface PriceSummaryQRProps {
  saleArtworkId: string
}

export const PriceSummary = withSuspense<PriceSummaryQRProps>({
  Component: ({ saleArtworkId }) => {
    const selectedBid = BidFlowContextStore.useStoreState((state) => state.selectedBid)

    const initialData = useLazyLoadQuery<PriceSummaryQuery>(priceSummaryQuery, {
      saleArtworkId: saleArtworkId,
      bidAmountMinor: selectedBid.cents ?? 0,
    })

    if (!initialData?.node?.calculatedCost) {
      return null
    }

    return <PriceSummary_ calculatedCost={initialData.node.calculatedCost} />
  },
  ErrorFallback: NoFallback,
  LoadingFallback: SpinnerFallback,
})

const priceSummaryQuery = graphql`
  query PriceSummaryQuery($saleArtworkId: ID!, $bidAmountMinor: Int!) {
    node(id: $saleArtworkId) {
      ... on SaleArtwork {
        calculatedCost(bidAmountMinor: $bidAmountMinor) {
          ...PriceSummary_calculatedCost
        }
      }
    }
  }
`

const priceSummaryFragment = graphql`
  fragment PriceSummary_calculatedCost on CalculatedCost {
    buyersPremium {
      display
    }
    subtotal {
      display
    }
  }
`
