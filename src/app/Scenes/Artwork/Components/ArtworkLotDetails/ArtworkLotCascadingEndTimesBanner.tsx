import { navigate } from "app/navigation/navigate"
import { Flex, Text } from "palette"

interface ArtworkLotCascadingEndTimesBannerProps {
  cascadingEndTimeInterval: number
  extendedBiddingIntervalMinutes?: number | null
}

const CASCADING_AUCTION_HELP_ARTICLE_LINK =
  "https://support.artsy.net/hc/en-us/articles/4831514125975-What-is-cascade-bidding-and-how-does-it-work"

export const ArtworkLotCascadingEndTimesBanner: React.FC<
  ArtworkLotCascadingEndTimesBannerProps
> = ({ cascadingEndTimeInterval, extendedBiddingIntervalMinutes }) => {
  const canBeExtended = !!extendedBiddingIntervalMinutes

  return (
    <Flex backgroundColor="black10" py={1} px={2} mx={-2}>
      <Text variant="sm" style={{ textAlign: "center" }}>
        {canBeExtended
          ? "Closing times may be extended due to last-minute competitive bidding. "
          : `Lots will close at ${cascadingEndTimeInterval}-minute intervals. `}

        <Text
          onPress={() => navigate(CASCADING_AUCTION_HELP_ARTICLE_LINK)}
          style={{ textDecorationLine: "underline" }}
        >
          Learn more.
        </Text>
      </Text>
    </Flex>
  )
}
