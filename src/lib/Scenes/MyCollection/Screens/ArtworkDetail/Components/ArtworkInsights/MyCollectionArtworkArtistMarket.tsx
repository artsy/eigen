import { MyCollectionArtworkArtistMarket_marketPriceInsights } from "__generated__/MyCollectionArtworkArtistMarket_marketPriceInsights.graphql"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { AppStore } from "lib/store/AppStore"
import { Spacer } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { Field } from "../Field"
import { InfoButton } from "./InfoButton"

interface MyCollectionArtworkArtistMarketProps {
  marketPriceInsights: MyCollectionArtworkArtistMarket_marketPriceInsights
}

const MyCollectionArtworkArtistMarket: React.FC<MyCollectionArtworkArtistMarketProps> = () => {
  const navActions = AppStore.actions.myCollection.navigation

  return (
    <ScreenMargin>
      <InfoButton
        title="Artist market"
        subTitle="Based on 36 months of auction data"
        onPress={() => navActions.showInfoModal("artistMarket")}
      />

      <Spacer my={0.5} />

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
