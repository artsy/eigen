import { MyCollectionArtworkPurchaseDetails_artwork$key } from "__generated__/MyCollectionArtworkPurchaseDetails_artwork.graphql"
import { isEmpty } from "lodash"
import { Flex, Text } from "palette"
import React from "react"
import { graphql, useFragment } from "react-relay"
import { Field } from "../Field"

interface MyCollectionArtworkPurchaseDetailsProps {
  artwork: MyCollectionArtworkPurchaseDetails_artwork$key
}

export const MyCollectionArtworkPurchaseDetails: React.FC<
  MyCollectionArtworkPurchaseDetailsProps
> = (props) => {
  const artwork = useFragment(artworkFragment, props.artwork)

  const { pricePaid } = artwork

  if (isEmpty(pricePaid)) {
    return null
  }

  return (
    <Flex mb={4}>
      <Text variant="lg" my={1}>
        Purchase Details
      </Text>

      {!!pricePaid && <Field label="Price Paid" value={pricePaid.display} />}
    </Flex>
  )
}

const artworkFragment = graphql`
  fragment MyCollectionArtworkPurchaseDetails_artwork on Artwork {
    pricePaid {
      display
    }
  }
`
