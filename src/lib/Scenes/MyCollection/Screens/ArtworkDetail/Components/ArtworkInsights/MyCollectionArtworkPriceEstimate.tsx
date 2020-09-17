import { MyCollectionArtworkPriceEstimate_marketPriceInsights } from "__generated__/MyCollectionArtworkPriceEstimate_marketPriceInsights.graphql"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { formatCentsToDollars } from "lib/Scenes/MyCollection/utils/formatCentsToDollars"
import { AppStore } from "lib/store/AppStore"
import { Flex, Spacer, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { Field } from "../Field"
import { InfoButton } from "./InfoButton"

interface MyCollectionArtworkPriceEstimateProps {
  marketPriceInsights: MyCollectionArtworkPriceEstimate_marketPriceInsights
}

const MyCollectionArtworkPriceEstimate: React.FC<MyCollectionArtworkPriceEstimateProps> = ({ marketPriceInsights }) => {
  if (!marketPriceInsights) {
    return null
  }

  const navActions = AppStore.actions.myCollection.navigation
  const { lowRangeCents, midRangeCents, highRangeCents, artsyQInventory } = marketPriceInsights
  const lowRangeDollars = formatCentsToDollars(Number(lowRangeCents))
  const midRangeDollars = formatCentsToDollars(Number(midRangeCents))
  const highRangeDollars = formatCentsToDollars(Number(highRangeCents))

  return (
    <ScreenMargin>
      <InfoButton
        title="Price estimate"
        subTitle={`Based on ${artsyQInventory} comparable works`}
        onPress={() => navActions.showInfoModal("priceEstimate")}
      />

      <Spacer my={0.5} />

      <Flex flexDirection="row" alignItems="flex-end">
        <Text variant="largeTitle" mr={0.5}>
          {midRangeDollars}
        </Text>
        <Text variant="small" color="black60">
          Median
        </Text>
      </Flex>

      <Spacer mt={0.5} />

      <Field label="Sold price range" value={`${lowRangeDollars} – ${highRangeDollars}`} />
      <Field label="Your price paid for this work" value="TODO - €9,900" />
    </ScreenMargin>
  )
}

export const MyCollectionArtworkPriceEstimateFragmentContainer = createFragmentContainer(
  MyCollectionArtworkPriceEstimate,
  {
    marketPriceInsights: graphql`
      fragment MyCollectionArtworkPriceEstimate_marketPriceInsights on MarketPriceInsights {
        # FIXME: These props are coming back from diffusion untyped
        lowRangeCents
        midRangeCents
        highRangeCents
        artsyQInventory
      }
    `,
  }
)
