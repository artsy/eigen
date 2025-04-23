import { Flex, Text } from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"

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

        <Text
          color="mono0"
          onPress={() => navigate(CASCADING_AUCTION_HELP_ARTICLE_LINK)}
          style={{ textDecorationLine: "underline" }}
        >
          Learn more.
        </Text>
      </Text>
    </Flex>
  )
}
