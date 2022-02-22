import { MyCollectionArtworkAbout_artwork$key } from "__generated__/MyCollectionArtworkAbout_artwork.graphql"
import { Flex, Text } from "palette/elements"
import React from "react"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface MyCollectionArtworkAboutProps {
  artwork: MyCollectionArtworkAbout_artwork$key
}

export const MyCollectionArtworkAbout: React.FC<MyCollectionArtworkAboutProps> = ({
  ...restProps
}) => {
  const artwork = useFragment<MyCollectionArtworkAbout_artwork$key>(
    artworkFragment,
    restProps.artwork
  )

  return (
    <Flex>
      <Text>Price & Market Insights</Text>
      <Text>{artwork.id}</Text>
    </Flex>
  )
}

const artworkFragment = graphql`
  fragment MyCollectionArtworkAbout_artwork on Artwork {
    id
    slug
    internalID
  }
`
