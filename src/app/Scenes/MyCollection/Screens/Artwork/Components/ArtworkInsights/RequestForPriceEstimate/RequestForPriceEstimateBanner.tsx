import { ActionType, ContextModule, OwnerType, TappedRequestPriceEstimate } from "@artsy/cohesion"
import { CheckCircleIcon, Flex, Box, Text, Separator, Button } from "@artsy/palette-mobile"
import { RequestForPriceEstimateBanner_artwork$key } from "__generated__/RequestForPriceEstimateBanner_artwork.graphql"
import { RequestForPriceEstimateBanner_marketPriceInsights$key } from "__generated__/RequestForPriceEstimateBanner_marketPriceInsights.graphql"
import { RequestForPriceEstimateBanner_me$key } from "__generated__/RequestForPriceEstimateBanner_me.graphql"
import { Toast } from "app/Components/Toast/Toast"
import { GlobalStore } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
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

  const enableRemotePriceEstimateRequestedLogic = useFeatureFlag(
    "AREnableNewRequestPriceEstimateLogic"
  )

  const localRequestedPriceEstimates = GlobalStore.useAppState(
    (state) => state.requestedPriceEstimates.requestedPriceEstimates
  )

  const priceEstimateRequested =
    (enableRemotePriceEstimateRequestedLogic && artwork.hasPriceEstimateRequest) ||
    !!localRequestedPriceEstimates[artwork.internalID]

  if (priceEstimateRequested) {
    return (
      <Box>
        <Flex alignItems="center" flexDirection="row">
          <CheckCircleIcon />
          <Text variant="sm" ml={0.5} textAlign="center">
            Price Estimate Request Sent
          </Text>
        </Flex>

        <Separator mt={2} mb={4} borderColor="black10" />
      </Box>
    )
  }

  if (!artwork.isPriceEstimateRequestable) {
    return null
  }

  return (
    <Box>
      <Text variant="sm" testID="request-price-estimate-banner-title">
        Get a Free Price Estimate
      </Text>
      <Text color="black60" mb={2} variant="xs" testID="request-price-estimate-banner-description">
        This artwork is eligible for a free evaluation from an Artsy specialist.
      </Text>
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
          navigate(`/my-collection/artwork/${artwork.internalID}/price-estimate`, {
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
        variant="fillDark"
      >
        Request a Price Estimate
      </Button>

      <Separator mt={2} mb={4} borderColor="black10" />
    </Box>
  )
}

const artworkFragment = graphql`
  fragment RequestForPriceEstimateBanner_artwork on Artwork {
    internalID
    slug
    hasPriceEstimateRequest
    isPriceEstimateRequestable
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
