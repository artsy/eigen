import {
  MyCollectionArtworkAboutWork_artwork,
  MyCollectionArtworkAboutWork_artwork$key,
} from "__generated__/MyCollectionArtworkAboutWork_artwork.graphql"
import {
  MyCollectionArtworkAboutWork_marketPriceInsights,
  MyCollectionArtworkAboutWork_marketPriceInsights$key,
} from "__generated__/MyCollectionArtworkAboutWork_marketPriceInsights.graphql"
import { formatCentsToDollars } from "lib/Scenes/MyCollection/utils/formatCentsToDollars"
import { capitalize } from "lodash"
import { Flex, Text } from "palette"
import React from "react"
import { graphql, useFragment } from "react-relay"
import { Field } from "../Field"

interface MyCollectionArtworkAboutWorkProps {
  artwork: MyCollectionArtworkAboutWork_artwork$key
  marketPriceInsights: MyCollectionArtworkAboutWork_marketPriceInsights$key | null
}

export const MyCollectionArtworkAboutWork: React.FC<MyCollectionArtworkAboutWorkProps> = (
  props
) => {
  const artwork = useFragment<MyCollectionArtworkAboutWork_artwork$key>(
    artworkFragment,
    props.artwork
  )
  const marketPriceInsights = useFragment<MyCollectionArtworkAboutWork_marketPriceInsights$key>(
    marketPriceInsightsFragment,
    props.marketPriceInsights
  )

  const { category, medium, dimensions, date, provenance } = artwork

  const dimensionsText = getDimensionsText(dimensions)
  const estimatePrice = marketPriceInsights ? getEstimatePrice(marketPriceInsights) : ""

  return (
    <Flex mb={4}>
      <Text variant="lg" my={1}>
        About the work
      </Text>

      <Field label="Estimate Range" value={estimatePrice} />
      <Field label="Medium" value={capitalize(category!)} />
      <Field label="Materials" value={capitalize(medium!)} />
      <Field label="Dimensions" value={dimensionsText} />
      <Field label="Year created" value={date} />
      <Field label="Provenance" value={provenance} />
    </Flex>
  )
}

const artworkFragment = graphql`
  fragment MyCollectionArtworkAboutWork_artwork on Artwork {
    # Price Estimate
    category
    medium
    dimensions {
      in
      cm
    }
    date
    provenance
  }
`

const marketPriceInsightsFragment = graphql`
  fragment MyCollectionArtworkAboutWork_marketPriceInsights on MarketPriceInsights {
    lowRangeCents
    highRangeCents
  }
`

const getDimensionsText = (dimensions: MyCollectionArtworkAboutWork_artwork["dimensions"]) => {
  if (dimensions === null) {
    return ""
  }

  return [dimensions.in, dimensions.cm].filter((d) => d).join("\n")
}

const getEstimatePrice = ({
  lowRangeCents,
  highRangeCents,
}: MyCollectionArtworkAboutWork_marketPriceInsights) => {
  if (!lowRangeCents || !highRangeCents) {
    return ""
  }

  return `${formatCentsToDollars(Number(lowRangeCents))} - ${formatCentsToDollars(
    Number(highRangeCents)
  )}`
}
