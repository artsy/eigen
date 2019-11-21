import { Box, color, Serif } from "@artsy/palette"
import { CollectionHeader_collection } from "__generated__/CollectionHeader_collection.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import React from "react"
import { Dimensions } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface CollectionHeaderProps {
  collection: CollectionHeader_collection
}

export const CollectionHeader: React.SFC<CollectionHeaderProps> = props => {
  const { title, description, image, headerImage } = props.collection
  const url = headerImage ? headerImage : image.edges[0].node.imageUrl
  const { width: screenWidth } = Dimensions.get("window")
  const imageHeight = 204

  return (
    <>
      <Box mb={2}>
        <OpaqueImageView imageURL={url} height={imageHeight} width={screenWidth} />
      </Box>
      <Serif size="8" color={color("black100")} ml={2}>
        {title}
      </Serif>
      <Serif size="4" color={color("black100")} mt={2}>
        {description}
      </Serif>
    </>
  )
}

export const CollectionHeaderContainer = createFragmentContainer(CollectionHeader, {
  collection: graphql`
    fragment CollectionHeader_collection on MarketingCollection {
      title
      description
      headerImage
      image: artworksConnection(sort: "-merchandisability", first: 1) {
        edges {
          node {
            imageUrl
          }
        }
      }
    }
  `,
})
