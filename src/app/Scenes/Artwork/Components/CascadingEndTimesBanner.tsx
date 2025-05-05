import { Flex, Text } from "@artsy/palette-mobile"
import { RouterLink } from "app/system/navigation/RouterLink"

interface CascadingEndTimesBannerProps {
  cascadingEndTimeInterval: number
  extendedBiddingIntervalMinutes?: number | null
}

const CASCADING_AUCTION_HELP_ARTICLE_LINK =
  "https://support.artsy.net/s/article/What-is-cascade-and-popcorn-bidding-and-how-does-it-work"

export const CascadingEndTimesBanner: React.FC<CascadingEndTimesBannerProps> = ({
  cascadingEndTimeInterval,
  extendedBiddingIntervalMinutes,
}) => {
  const canBeExtended = !!extendedBiddingIntervalMinutes

  return (
    <Flex backgroundColor="blue100" p={2}>
      <Text color="mono0" style={{ textAlign: "center" }}>
        {canBeExtended
          ? "Closing times may be extended due to last-minute competitive bidding. "
          : `Lots will close at ${cascadingEndTimeInterval}-minute intervals. `}

        <RouterLink to={CASCADING_AUCTION_HELP_ARTICLE_LINK} hasChildTouchable>
          <Text style={{ textDecorationLine: "underline" }}>
            Learn more about cascading end times
          </Text>
        </RouterLink>
      </Text>
    </Flex>
  )
}
