import { Flex } from "@artsy/palette-mobile"
import { MyCollectionArtworkAboutWork_artwork$key } from "__generated__/MyCollectionArtworkAboutWork_artwork.graphql"
import { MyCollectionArtworkAboutWork_marketPriceInsights$key } from "__generated__/MyCollectionArtworkAboutWork_marketPriceInsights.graphql"
import { buildLocationDisplay } from "app/Components/LocationAutocomplete"
import { Field, MetaDataField } from "app/Scenes/MyCollection/Screens/Artwork/Components/Field"
import { formatCentsToDollars } from "app/Scenes/MyCollection/utils/formatCentsToDollars"
import { capitalize } from "lodash"
import { graphql, useFragment } from "react-relay"

interface EstimatePriceType {
  lowRangeCents: number | null
  highRangeCents: number | null
}

interface MyCollectionArtworkAboutWorkProps {
  artwork: MyCollectionArtworkAboutWork_artwork$key
  marketPriceInsights: MyCollectionArtworkAboutWork_marketPriceInsights$key | null | undefined
}

export const MyCollectionArtworkAboutWork: React.FC<MyCollectionArtworkAboutWorkProps> = (
  props
) => {
  const artwork = useFragment(artworkFragment, props.artwork)
  const marketPriceInsights = useFragment(marketPriceInsightsFragment, props.marketPriceInsights)

  const {
    category,
    confidentialNotes,
    medium,
    attributionClass,
    editionOf,
    dimensions,
    collectorLocation,
    date,
    provenance,
    metric,
    pricePaid,
  } = artwork

  // FIXME: types of these values are unknown (coming from MP), so it needs to be casted to Number to work properly here
  const estimatePrice = getEstimatePrice({
    lowRangeCents: Number(marketPriceInsights?.lowRangeCents),
    highRangeCents: Number(marketPriceInsights?.highRangeCents),
  })

  const rarityText = `${capitalize(attributionClass?.shortDescription || undefined)}${
    editionOf ? `\n${editionOf}` : ""
  }`

  return (
    <Flex px={2}>
      <Field label="Estimate Range" value={estimatePrice} />
      <MetaDataField label="Medium" value={capitalize(category || "")} />
      <MetaDataField label="Materials" value={capitalize(medium || "")} />
      <MetaDataField label="Rarity" value={rarityText} />
      <MetaDataField label="Dimensions" value={metric === "in" ? dimensions?.in : dimensions?.cm} />
      <MetaDataField label="Location" value={buildLocationDisplay(collectorLocation)} />
      <MetaDataField label="Year created" value={date} />
      <MetaDataField label="Provenance" value={provenance} />
      <MetaDataField label="Price Paid" value={pricePaid?.display} />
      {confidentialNotes ? (
        <MetaDataField label="Notes" value={confidentialNotes} truncateLimit={70} />
      ) : null}
    </Flex>
  )
}

const artworkFragment = graphql`
  fragment MyCollectionArtworkAboutWork_artwork on Artwork {
    category
    confidentialNotes
    medium
    metric
    dimensions {
      in
      cm
    }
    date
    provenance
    attributionClass {
      shortDescription
    }
    editionOf
    collectorLocation {
      city
      state
      country
      countryCode
    }
    pricePaid {
      display
    }
  }
`

const marketPriceInsightsFragment = graphql`
  fragment MyCollectionArtworkAboutWork_marketPriceInsights on MarketPriceInsights {
    lowRangeCents
    highRangeCents
  }
`

export const getEstimatePrice = ({ lowRangeCents, highRangeCents }: EstimatePriceType) => {
  if (!lowRangeCents || !highRangeCents) {
    return ""
  }

  return `${formatCentsToDollars(lowRangeCents)} - ${formatCentsToDollars(highRangeCents)}`
}
