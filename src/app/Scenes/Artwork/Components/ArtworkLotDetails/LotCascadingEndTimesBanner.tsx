import { Flex, Text } from "@artsy/palette-mobile"
import { LotCascadingEndTimesBanner_sale$key } from "__generated__/LotCascadingEndTimesBanner_sale.graphql"
import { navigate } from "app/system/navigation/navigate"
import { graphql, useFragment } from "react-relay"

interface LotCascadingEndTimesBannerProps {
  sale: LotCascadingEndTimesBanner_sale$key
}

const CASCADING_AUCTION_HELP_ARTICLE_LINK =
  "https://support.artsy.net/s/article/What-is-cascade-and-popcorn-bidding-and-how-does-it-work"

export const LotCascadingEndTimesBanner: React.FC<LotCascadingEndTimesBannerProps> = ({ sale }) => {
  const data = useFragment(lotCascadingEndTimesBannerFragment, sale)
  const { extendedBiddingIntervalMinutes, cascadingEndTimeIntervalMinutes } = data

  return (
    <Flex backgroundColor="mono10" py={1} px={2} mx={-2}>
      <Text variant="sm" style={{ textAlign: "center" }}>
        {extendedBiddingIntervalMinutes
          ? "Closing times may vary due to last minute competitive bidding. "
          : `Lots will close at ${cascadingEndTimeIntervalMinutes}-minute intervals. `}

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

const lotCascadingEndTimesBannerFragment = graphql`
  fragment LotCascadingEndTimesBanner_sale on Sale {
    cascadingEndTimeIntervalMinutes
    extendedBiddingIntervalMinutes
  }
`
