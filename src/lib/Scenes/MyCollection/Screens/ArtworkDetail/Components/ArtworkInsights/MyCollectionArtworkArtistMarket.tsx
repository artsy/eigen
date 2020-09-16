import { MyCollectionArtworkArtistMarket_marketPriceInsights } from "__generated__/MyCollectionArtworkArtistMarket_marketPriceInsights.graphql"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { Flex, InfoCircleIcon, Spacer, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { Field } from "../Field"

interface MyCollectionArtworkArtistMarketProps {
  marketPriceInsights: MyCollectionArtworkArtistMarket_marketPriceInsights
}

const MyCollectionArtworkArtistMarket: React.FC<MyCollectionArtworkArtistMarketProps> = (props) => {
  return (
    <ScreenMargin>
      <Flex flexDirection="row">
        <Text variant="mediumText" mr={0.5}>
          Artist market
        </Text>
        <InfoCircleIcon />
      </Flex>
      <Text>Based on 36 months of auction data</Text>

      <Spacer mt={1} />

      <Field label="Avg. Annual Value Sold" value="$5,346,000" />
      <Field label="Avg. Annual Lots Sold" value="25 - 50" />
      <Field label="Sell-through Rate" value="94.5%" />
      <Field label="Median Sale Price to Estimate" value="1.70x" />
      <Field label="Liquidity" value="Very high" />
      <Field label="1-Year Trend" value="Flat" />
    </ScreenMargin>
  )
}

export const MyCollectionArtworkArtistMarketFragmentContainer = createFragmentContainer(
  MyCollectionArtworkArtistMarket,
  {
    marketPriceInsights: graphql`
      fragment MyCollectionArtworkArtistMarket_marketPriceInsights on MarketPriceInsights {
        annualLotsSold
      }
    `,
  }
)
