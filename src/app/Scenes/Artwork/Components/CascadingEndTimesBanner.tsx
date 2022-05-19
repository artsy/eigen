import { navigate } from "app/navigation/navigate"
import { Flex, Text } from "palette"
import React from "react"
import Config from "react-native-config"

interface CascadingEndTimesBannerProps {
  cascadingEndTimeInterval: number
  extendedBiddingIntervalMinutes?: number | null
}

export const CascadingEndTimesBanner: React.FC<CascadingEndTimesBannerProps> = ({
  cascadingEndTimeInterval,
  extendedBiddingIntervalMinutes,
}) => {
  const canBeExtended = !!extendedBiddingIntervalMinutes
  const helpArticleLink = Config.CASCADING_AUCTION_HELP_ARTICLE_LINK
  const hasLink = !!helpArticleLink

  return (
    <Flex backgroundColor="blue100" p={2} my={2} ml={-2} mr={-2}>
      <Text color="white" style={{ textAlign: "center" }}>
        {canBeExtended
          ? "Closing times may be extended due to last minute competitive bidding. "
          : `Lots will close at ${cascadingEndTimeInterval}-minute intervals. `}
        {!!hasLink && (
          <Text
            color="white"
            onPress={() => navigate(helpArticleLink)}
            style={{ textDecorationLine: "underline" }}
          >
            Learn more.
          </Text>
        )}
      </Text>
    </Flex>
  )
}
