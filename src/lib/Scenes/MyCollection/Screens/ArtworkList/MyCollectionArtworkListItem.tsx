import { MyCollectionArtworkListItem_artwork$key } from "__generated__/MyCollectionArtworkListItem_artwork.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { Box, color, Flex, Sans } from "palette"
import React from "react"
import { GestureResponderEvent } from "react-native"
import { graphql, useFragment } from "relay-hooks"
import styled from "styled-components/native"

interface MyCollectionArtworkListItemProps {
  artwork: MyCollectionArtworkListItem_artwork$key
  onPress: (event: GestureResponderEvent) => void
}

export const MyCollectionArtworkListItem: React.FC<MyCollectionArtworkListItemProps> = ({ artwork, onPress }) => {
  const artworkProps = useFragment(
    graphql`
      fragment MyCollectionArtworkListItem_artwork on Artwork {
        id
        slug
        artistNames
        medium
        image {
          url
        }
      }
    `,
    artwork
  )

  const imageURL = artworkProps?.image?.url

  const Image = () =>
    !!imageURL ? (
      <OpaqueImageView imageURL={imageURL.replace(":version", "square")} width={90} height={90} />
    ) : (
      <Box bg={color("black30")} width={90} height={90} />
    )

  const Medium = () =>
    !!artworkProps.medium ? (
      <Sans size="3t" color="black60" numberOfLines={1}>
        {capitalize(artworkProps.medium)}
      </Sans>
    ) : null

  return (
    <TouchElement onPress={onPress}>
      <Flex m={1} flexDirection="row" alignItems="center">
        <Image />
        <Box mx={1}>
          <Sans size="4">{artworkProps.artistNames}</Sans>
          <Medium />
        </Box>
      </Flex>
    </TouchElement>
  )
}

const TouchElement = styled.TouchableHighlight.attrs({
  underlayColor: color("white100"),
  activeOpacity: 0.8,
})``
