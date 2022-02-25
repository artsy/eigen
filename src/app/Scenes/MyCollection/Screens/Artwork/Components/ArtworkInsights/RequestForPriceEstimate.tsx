import { RequestForPriceEstimate_artwork$key } from "__generated__/RequestForPriceEstimate_artwork.graphql"
import { RequestForPriceEstimate_marketPriceInsights$key } from "__generated__/RequestForPriceEstimate_marketPriceInsights.graphql"
import { Box, Button, Text } from "palette"
import React from "react"
import { graphql, useFragment } from "react-relay"

interface RequestForPriceEstimateProps {
  artwork: RequestForPriceEstimate_artwork$key
  marketPriceInsights: RequestForPriceEstimate_marketPriceInsights$key | null
}
export const RequestForPriceEstimate: React.FC<RequestForPriceEstimateProps> = ({
  ...otherProps
}) => {
  const artwork = useFragment<RequestForPriceEstimate_artwork$key>(
    artworkFragment,
    otherProps.artwork
  )
  const marketPriceInsights = useFragment<RequestForPriceEstimate_marketPriceInsights$key>(
    marketPriceInsightsFragment,
    otherProps.marketPriceInsights
  )

  return (
    <Box>
      <Button
        testID="request-price-estimate-button"
        onPress={() => {
          // TODO:- CX-2355: Implement the actual email sending feature
        }}
        block
      >
        Request a Price Estimate
      </Button>
      <Text
        color="black60"
        textAlign="center"
        m={1}
        variant="xs"
        testID="request-price-estimate-banner-text"
      >
        An Artsy specialist will evaluate your artwork and contact you with a current price
        estimate.
      </Text>
    </Box>
  )
}

const artworkFragment = graphql`
  fragment RequestForPriceEstimate_artwork on Artwork {
    title
    medium
    artist {
      name
      targetSupply {
        isTargetSupply
      }
    }
    artists {
      name
      targetSupply {
        isTargetSupply
      }
    }
  }
`

const marketPriceInsightsFragment = graphql`
  fragment RequestForPriceEstimate_marketPriceInsights on MarketPriceInsights {
    demandRank
  }
`
