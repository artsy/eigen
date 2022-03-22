import { ActionType, ContextModule, OwnerType, TappedRequestPriceEstimate } from "@artsy/cohesion"
import { RequestForPriceEstimate_artwork$key } from "__generated__/RequestForPriceEstimate_artwork.graphql"
import { RequestForPriceEstimate_marketPriceInsights$key } from "__generated__/RequestForPriceEstimate_marketPriceInsights.graphql"
import { Box, Button, Text } from "palette"
import React from "react"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface RequestForPriceEstimateProps {
  artwork: RequestForPriceEstimate_artwork$key
  marketPriceInsights: RequestForPriceEstimate_marketPriceInsights$key | null
}
export const RequestForPriceEstimate: React.FC<RequestForPriceEstimateProps> = ({
  ...otherProps
}) => {
  const { trackEvent } = useTracking()

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
          trackEvent(
            tracks.trackTappedRequestPriceEstimate(
              artwork.internalID,
              artwork.slug,
              marketPriceInsights?.demandRank ?? undefined
            )
          )
        }}
        block
      >
        Request a Price Estimate
      </Button>
      <Text
        color="black60"
        textAlign="center"
        my={2}
        variant="xs"
        testID="request-price-estimate-banner-text"
      >
        An Artsy specialist will evaluate your artwork and contact you with a free price estimate.
      </Text>
    </Box>
  )
}

const artworkFragment = graphql`
  fragment RequestForPriceEstimate_artwork on Artwork {
    internalID
    slug
    title
    medium
    artist {
      name
      targetSupply {
        isP1
      }
    }
  }
`

const marketPriceInsightsFragment = graphql`
  fragment RequestForPriceEstimate_marketPriceInsights on MarketPriceInsights {
    demandRank
  }
`

const tracks = {
  trackTappedRequestPriceEstimate: (
    artworkId: string,
    artworkSlug?: string,
    demandRank?: number
  ): TappedRequestPriceEstimate => ({
    action: ActionType.tappedRequestPriceEstimate,
    context_module: ContextModule.myCollectionArtworkInsights,
    context_screen: OwnerType.myCollectionArtwork,
    context_screen_owner_id: artworkId,
    context_screen_owner_slug: artworkSlug,
    demand_index: demandRank,
  }),
}
