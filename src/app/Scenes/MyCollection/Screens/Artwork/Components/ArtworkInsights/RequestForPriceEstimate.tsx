import { ActionType, ContextModule, OwnerType, TappedRequestPriceEstimate } from "@artsy/cohesion"
import { RequestForPriceEstimate_artwork$key } from "__generated__/RequestForPriceEstimate_artwork.graphql"
import { RequestForPriceEstimate_marketPriceInsights$key } from "__generated__/RequestForPriceEstimate_marketPriceInsights.graphql"
import { RequestForPriceEstimate_me$key } from "__generated__/RequestForPriceEstimate_me.graphql"
import { navigate } from "app/navigation/navigate"
import { GlobalStore } from "app/store/GlobalStore"
import { Box, Button, CheckIcon, Text } from "palette"
import React, { useEffect } from "react"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface RequestForPriceEstimateProps {
  artwork: RequestForPriceEstimate_artwork$key
  marketPriceInsights: RequestForPriceEstimate_marketPriceInsights$key | null
  me: RequestForPriceEstimate_me$key | null
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

  const me = useFragment<RequestForPriceEstimate_me$key>(meFragment, otherProps.me)

  const requestedPriceEstimates = GlobalStore.useAppState(
    (state) => state.requestedPriceEstimates.requests
  )

  const priceEstimateRequested = !!requestedPriceEstimates[artwork.internalID]

  return (
    <Box>
      <Button
        testID="request-price-estimate-button"
        onPress={() => {
          trackEvent(
            tracks.trackTappedRequestPriceEstimate(
              artwork.internalID,
              artwork.slug,
              marketPriceInsights?.demandRank ?? undefined
            )
          )
          if (!me) {
            return
          }
          navigate("/request-for-price-estimate", {
            passProps: {
              artworkId: artwork.internalID,
              name: me.name,
              email: me.email,
              phone: me.phone,
            },
          })
        }}
        block
        disabled={priceEstimateRequested}
        variant={priceEstimateRequested ? "fillSuccess" : "fillDark"}
        icon={
          priceEstimateRequested ? <CheckIcon fill="white100" width={25} height={25} /> : undefined
        }
      >
        {priceEstimateRequested ? "Price Estimate Request Sent" : "Request a Price Estimate"}
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

const meFragment = graphql`
  fragment RequestForPriceEstimate_me on Me {
    name
    email
    phone
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
