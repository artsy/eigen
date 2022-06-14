import { navigate } from "app/navigation/navigate"
import { Flex, Text } from "palette"
import React from "react"

interface CascadingEndTimesBannerProps {
  cascadingEndTimeInterval: number
  extendedBiddingIntervalMinutes?: number | null
}

const CASCADING_AUCTION_HELP_ARTICLE_LINK =
  "https://support.artsy.net/hc/en-us/articles/4831514125975-What-is-cascade-bidding-and-how-does-it-work"

export const CascadingEndTimesBanner: React.FC<CascadingEndTimesBannerProps> = ({
  cascadingEndTimeInterval,
  extendedBiddingIntervalMinutes,
}) => {
  const canBeExtended = !!extendedBiddingIntervalMinutes

  return (
    <Flex backgroundColor="blue100" p={2} my={2} ml={-2} mr={-2}>
      <Text color="white" style={{ textAlign: "center" }}>
        {canBeExtended
          ? "Closing times may be extended due to last minute competitive bidding. "
          : `Lots will close at ${cascadingEndTimeInterval}-minute intervals. `}

        <Text
          color="white"
          onPress={() => navigate(CASCADING_AUCTION_HELP_ARTICLE_LINK)}
          style={{ textDecorationLine: "underline" }}
        >
          Learn more.
        </Text>
      </Text>
    </Flex>
  )
}
