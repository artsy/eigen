import { Box, CheckCircleIcon, Flex, Separator, Text } from "@artsy/palette-mobile"
import { RequestForPriceEstimateBanner_artwork$key } from "__generated__/RequestForPriceEstimateBanner_artwork.graphql"
import { RequestForPriceEstimateBanner_me$key } from "__generated__/RequestForPriceEstimateBanner_me.graphql"
import { artworkFragment } from "app/Scenes/MyCollection/Screens/Artwork/Components/ArtworkInsights/RequestForPriceEstimate/RequestForPriceEstimateBanner"
import { usePriceEstimateRequested } from "app/Scenes/MyCollection/Screens/Artwork/Components/ArtworkInsights/RequestForPriceEstimate/usePriceEstimateRequested"
import { useFragment } from "react-relay"

interface PriceEstimateRequestedProps {
  artwork: RequestForPriceEstimateBanner_artwork$key
  me: RequestForPriceEstimateBanner_me$key | null | undefined
}

export const PriceEstimateRequested: React.FC<PriceEstimateRequestedProps> = ({
  ...otherProps
}) => {
  const artwork = useFragment(artworkFragment, otherProps.artwork)
  const priceEstimateRequested = usePriceEstimateRequested(artwork)

  if (!priceEstimateRequested) return null

  return (
    <Box>
      <Flex alignItems="center" flexDirection="row">
        <CheckCircleIcon />
        <Text variant="sm" ml={0.5} textAlign="center">
          Price Estimate Request Sent
        </Text>
      </Flex>
      <Separator my={4} borderColor="black10" />
    </Box>
  )
}
