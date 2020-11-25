import { MyCollectionArtworkPriceEstimate_artwork } from "__generated__/MyCollectionArtworkPriceEstimate_artwork.graphql"
import { MyCollectionArtworkPriceEstimate_marketPriceInsights } from "__generated__/MyCollectionArtworkPriceEstimate_marketPriceInsights.graphql"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { formatCentsToDollars } from "lib/Scenes/MyCollection/utils/formatCentsToDollars"
import { Flex, Spacer, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { Field } from "../Field"
import { InfoButton } from "./InfoButton"

interface MyCollectionArtworkPriceEstimateProps {
  artwork: MyCollectionArtworkPriceEstimate_artwork
  marketPriceInsights: MyCollectionArtworkPriceEstimate_marketPriceInsights
}

const rangeCents = (
  artwork: MyCollectionArtworkPriceEstimate_artwork,
  marketPriceInsights: MyCollectionArtworkPriceEstimate_marketPriceInsights
) => {
  const {
    lowRangeCents,
    midRangeCents,
    highRangeCents,
    largeHighRangeCents,
    largeLowRangeCents,
    largeMidRangeCents,
    mediumHighRangeCents,
    mediumLowRangeCents,
    mediumMidRangeCents,
    smallHighRangeCents,
    smallLowRangeCents,
    smallMidRangeCents,
  } = marketPriceInsights

  let lowCents
  let midCents
  let highCents

  switch (artwork.sizeBucket) {
    case "small": {
      lowCents = smallLowRangeCents
      midCents = smallMidRangeCents
      highCents = smallHighRangeCents
      break
    }
    case "medium": {
      lowCents = mediumLowRangeCents
      midCents = mediumMidRangeCents
      highCents = mediumHighRangeCents
      break
    }
    case "large": {
      lowCents = largeLowRangeCents
      midCents = largeMidRangeCents
      highCents = largeHighRangeCents
      break
    }
    default: {
      lowCents = lowRangeCents
      midCents = midRangeCents
      highCents = highRangeCents
    }
  }

  if (Number(lowCents) === 0 || Number(midCents) === 0 || Number(highCents) === 0) {
    lowCents = lowRangeCents
    midCents = midRangeCents
    highCents = highRangeCents
  }

  return {
    lowRangeCents: lowCents,
    midRangeCents: midCents,
    highRangeCents: highCents,
  }
}

const MyCollectionArtworkPriceEstimate: React.FC<MyCollectionArtworkPriceEstimateProps> = ({
  artwork,
  marketPriceInsights,
}) => {
  if (!marketPriceInsights) {
    return null
  }

  const { artsyQInventory } = marketPriceInsights

  const { lowRangeCents, midRangeCents, highRangeCents } = rangeCents(artwork, marketPriceInsights)

  const lowRangeDollars = formatCentsToDollars(Number(lowRangeCents))
  const midRangeDollars = formatCentsToDollars(Number(midRangeCents))
  const highRangeDollars = formatCentsToDollars(Number(highRangeCents))

  // TODO: costMinor needs to be converted from cents to dollars
  const pricePaid = artwork.costCurrencyCode && artwork.costMinor && `${artwork.costCurrencyCode} ${artwork.costMinor}`

  return (
    <ScreenMargin>
      <InfoButton
        title="Price estimate"
        modalTitle="Estimated Price Range"
        subTitle={`Based on ${artsyQInventory} comparable works`}
        modalContent={
          <>
            <Text>
              This is an estimated range based on artist, medium, and size, and is not an official valuation for your
              exact artwork. This is based on 36 months of auction result data.
            </Text>
            <Spacer my={1} />
            <Text>Last updated Aug 30, 2020.</Text>
          </>
        }
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

      {!!pricePaid && <Field label="Your price paid for this work" value={pricePaid} />}
    </ScreenMargin>
  )
}

export const MyCollectionArtworkPriceEstimateFragmentContainer = createFragmentContainer(
  MyCollectionArtworkPriceEstimate,
  {
    artwork: graphql`
      fragment MyCollectionArtworkPriceEstimate_artwork on Artwork {
        costCurrencyCode
        costMinor
        sizeBucket
      }
    `,
    marketPriceInsights: graphql`
      fragment MyCollectionArtworkPriceEstimate_marketPriceInsights on MarketPriceInsights {
        # FIXME: These props are coming back from diffusion untyped as strings
        highRangeCents
        largeHighRangeCents
        largeLowRangeCents
        largeMidRangeCents
        lowRangeCents
        mediumHighRangeCents
        mediumLowRangeCents
        mediumMidRangeCents
        midRangeCents
        smallHighRangeCents
        smallLowRangeCents
        smallMidRangeCents
        artsyQInventory
      }
    `,
  }
)
