import { MyCollectionArtworkAboutWork_artwork$key } from "__generated__/MyCollectionArtworkAboutWork_artwork.graphql"
import { MyCollectionArtworkAboutWork_marketPriceInsights$key } from "__generated__/MyCollectionArtworkAboutWork_marketPriceInsights.graphql"
import { formatCentsToDollars } from "app/Scenes/MyCollection/utils/formatCentsToDollars"
import { useFeatureFlag } from "app/store/GlobalStore"
import { capitalize } from "lodash"
import { Flex, Text } from "palette"
import React from "react"
import { graphql, useFragment } from "react-relay"
import { Field } from "../Field"

interface EstimatePriceType {
  lowRangeCents: number | null
  highRangeCents: number | null
}

interface DimensionsType {
  in: string | null
  cm: string | null
}

interface MyCollectionArtworkAboutWorkProps {
  artwork: MyCollectionArtworkAboutWork_artwork$key
  marketPriceInsights: MyCollectionArtworkAboutWork_marketPriceInsights$key | null
}

export const MyCollectionArtworkAboutWork: React.FC<MyCollectionArtworkAboutWorkProps> = (
  props
) => {
  const artwork = useFragment(artworkFragment, props.artwork)
  const marketPriceInsights = useFragment(marketPriceInsightsFragment, props.marketPriceInsights)

  const enablePriceEstimateRange = useFeatureFlag("AREnablePriceEstimateRange")

  const { category, medium, dimensions, date, provenance } = artwork

  const dimensionsText = getDimensionsText(dimensions)
  // FIXME: types of these values are unknown (coming from MP), so it needs to be casted to Number to work properly here
  const estimatePrice = getEstimatePrice({
    lowRangeCents: Number(marketPriceInsights?.lowRangeCents),
    highRangeCents: Number(marketPriceInsights?.highRangeCents),
  })

  return (
    <Flex mb={4}>
      <Text variant="lg" my={1}>
        About the work
      </Text>

      {!!enablePriceEstimateRange && <Field label="Estimate Range" value={estimatePrice} />}
      <Field label="Medium" value={capitalize(medium!)} />
      <Field label="Materials" value={capitalize(category!)} />
      <Field label="Dimensions" value={dimensionsText} />
      <Field label="Year created" value={date} />
      <Field label="Provenance" value={provenance} />
    </Flex>
  )
}

const artworkFragment = graphql`
  fragment MyCollectionArtworkAboutWork_artwork on Artwork {
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

export const getDimensionsText = (dimensions: DimensionsType | null) => {
  if (dimensions === null) {
    return ""
  }

  return [dimensions.in, dimensions.cm].filter((d) => d).join("\n")
}

export const getEstimatePrice = ({ lowRangeCents, highRangeCents }: EstimatePriceType) => {
  if (!lowRangeCents || !highRangeCents) {
    return ""
  }

  return `${formatCentsToDollars(lowRangeCents)} - ${formatCentsToDollars(highRangeCents)}`
}
