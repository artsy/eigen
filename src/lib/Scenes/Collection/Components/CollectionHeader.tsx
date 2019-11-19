import { Box, color, Serif } from "@artsy/palette"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import React from "react"
import { Dimensions } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface CollectionHeaderProps {
  collection: {
    title: string
    description: string
    headerImage: string
    image: {
      edges: Array<{
        node: {
          imageUrl: string
        }
      }>
    }
  }
}

export const CollectionHeader: React.SFC<CollectionHeaderProps> = props => {
  const { title, description, image } = props.collection
  const url = image.edges[0].node.imageUrl || ""
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
