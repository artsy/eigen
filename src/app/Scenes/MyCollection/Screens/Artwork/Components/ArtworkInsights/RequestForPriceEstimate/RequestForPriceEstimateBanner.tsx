import { ActionType, ContextModule, OwnerType, TappedRequestPriceEstimate } from "@artsy/cohesion"
import { RequestForPriceEstimateBanner_artwork$key } from "__generated__/RequestForPriceEstimateBanner_artwork.graphql"
import { RequestForPriceEstimateBanner_marketPriceInsights$key } from "__generated__/RequestForPriceEstimateBanner_marketPriceInsights.graphql"
import { RequestForPriceEstimateBanner_me$key } from "__generated__/RequestForPriceEstimateBanner_me.graphql"
import { Toast } from "app/Components/Toast/Toast"
import { navigate } from "app/navigation/navigate"
import { GlobalStore } from "app/store/GlobalStore"
import { Box, Button, CheckIcon, Text } from "palette"
import React from "react"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
interface RequestForPriceEstimateProps {
  artwork: RequestForPriceEstimateBanner_artwork$key
  marketPriceInsights: RequestForPriceEstimateBanner_marketPriceInsights$key | null
  me: RequestForPriceEstimateBanner_me$key | null
}
export const RequestForPriceEstimateBanner: React.FC<RequestForPriceEstimateProps> = ({
  ...otherProps
}) => {
  const { trackEvent } = useTracking()

  const artwork = useFragment(artworkFragment, otherProps.artwork)
  const marketPriceInsights = useFragment(
    marketPriceInsightsFragment,
    otherProps.marketPriceInsights
  )

  const me = useFragment(meFragment, otherProps.me)

  const requestedPriceEstimates = GlobalStore.useAppState(
    (state) => state.requestedPriceEstimates.requestedPriceEstimates
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
            Toast.show(
              "Error: Unable to retrieve your basic info. Please try again later.",
              "top",
              {
                backgroundColor: "red100",
              }
            )
            return
          }
          navigate(`/my-collection/artwork/${artwork.internalID}/request-for-price-estimate`, {
            passProps: {
              name: me.name,
              email: me.email,
              phone: me.phone,
              demandRank: marketPriceInsights?.demandRank ?? undefined,
              artworkSlug: artwork.slug,
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
  fragment RequestForPriceEstimateBanner_artwork on Artwork {
    internalID
    slug
  }
`

const marketPriceInsightsFragment = graphql`
  fragment RequestForPriceEstimateBanner_marketPriceInsights on MarketPriceInsights {
    demandRank
  }
`

const meFragment = graphql`
  fragment RequestForPriceEstimateBanner_me on Me {
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
    context_screen: OwnerType.myCollectionArtworkInsights,
    context_screen_owner_type: OwnerType.myCollectionArtwork,
    context_screen_owner_id: artworkId,
    context_screen_owner_slug: artworkSlug,
    demand_index: demandRank,
  }),
}
