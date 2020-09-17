import { MyCollectionArtworkPriceEstimate_marketPriceInsights } from "__generated__/MyCollectionArtworkPriceEstimate_marketPriceInsights.graphql"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { AppStore } from "lib/store/AppStore"
import { Flex, Spacer, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { Field } from "../Field"
import { InfoButton } from "./InfoButton"

interface MyCollectionArtworkPriceEstimateProps {
  marketPriceInsights: MyCollectionArtworkPriceEstimate_marketPriceInsights
}

const MyCollectionArtworkPriceEstimate: React.FC<MyCollectionArtworkPriceEstimateProps> = () => {
  const navActions = AppStore.actions.myCollection.navigation

  return (
    <ScreenMargin>
      <InfoButton
        title="Price estimate"
        subTitle="Based on 23 comparable works"
        onPress={() => navActions.showInfoModal("priceEstimate")}
      />

      <Spacer my={0.5} />

      <Flex flexDirection="row" alignItems="flex-end">
        <Text variant="largeTitle" mr={0.5}>
          $43,100
        </Text>
        <Text variant="small" color="black60">
          Median
        </Text>
      </Flex>

      <Spacer mt={0.5} />

      <Field label="Sold price range" value="$10k – $96k" />
      <Field label="Your price paid for this work" value="€9,900" />
    </ScreenMargin>
  )
}

export const MyCollectionArtworkPriceEstimateFragmentContainer = createFragmentContainer(
  MyCollectionArtworkPriceEstimate,
  {
    marketPriceInsights: graphql`
      fragment MyCollectionArtworkPriceEstimate_marketPriceInsights on MarketPriceInsights {
        annualLotsSold
      }
    `,
  }
)
