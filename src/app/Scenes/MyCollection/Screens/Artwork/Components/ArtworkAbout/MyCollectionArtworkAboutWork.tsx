import {
  MyCollectionArtworkAboutWork_artwork,
  MyCollectionArtworkAboutWork_artwork$key,
} from "__generated__/MyCollectionArtworkAboutWork_artwork.graphql"
import { capitalize } from "lodash"
import { Flex, Text } from "palette"
import React from "react"
import { graphql, useFragment } from "react-relay"
import { Field } from "../Field"

interface MyCollectionArtworkAboutWorkProps {
  artwork: MyCollectionArtworkAboutWork_artwork$key
}

export const MyCollectionArtworkAboutWork: React.FC<MyCollectionArtworkAboutWorkProps> = (
  props
) => {
  const artwork = useFragment<MyCollectionArtworkAboutWork_artwork$key>(
    artworkFragment,
    props.artwork
  )

  const { category, medium, dimensions, date, provenance } = artwork

  const dimensionsText = getDimensionsText(dimensions)

  return (
    <Flex mb={4}>
      <Text variant="lg" my={1}>
        About the work
      </Text>

      {/* <Field label="Estimate Range" value="$400,000 - $450,000" /> */}
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

const getDimensionsText = (dimensions: MyCollectionArtworkAboutWork_artwork["dimensions"]) => {
  if (dimensions === null) {
    return ""
  }

  return [dimensions.in, dimensions.cm].filter((d) => d).join("\n")
}
