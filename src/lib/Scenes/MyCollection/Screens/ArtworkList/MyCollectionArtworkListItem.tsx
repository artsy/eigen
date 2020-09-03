import { MyCollectionArtworkListItem_artwork$key } from "__generated__/MyCollectionArtworkListItem_artwork.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { AppStore } from "lib/store/AppStore"
import { capitalize } from "lodash"
import { Box, Button, color, Flex, Sans } from "palette"
import React from "react"
import { GestureResponderEvent } from "react-native"
import { graphql, useFragment } from "relay-hooks"
import styled from "styled-components/native"

interface MyCollectionArtworkListItemProps {
  artwork: MyCollectionArtworkListItem_artwork$key
  onPress: (event: GestureResponderEvent) => void
}

export const MyCollectionArtworkListItem: React.FC<MyCollectionArtworkListItemProps> = ({ artwork, onPress }) => {
  const artworkActions = AppStore.actions.myCollection.artwork
  const artworkProps = useFragment(
    graphql`
      fragment MyCollectionArtworkListItem_artwork on Artwork {
        id
        internalID
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
      <Flex m={1} flexDirection="row" alignItems="center" justifyContent="space-between">
        <Flex flexDirection="row" alignItems="center">
          <Image />
          <Box mx={1}>
            <Sans size="4">{artworkProps.artistNames}</Sans>
            <Medium />
          </Box>
        </Flex>
        <Button
          size="small"
          onPress={() =>
            artworkActions.deleteArtwork({
              artworkId: artworkProps.internalID,
              artworkGlobalId: artworkProps.id,
            })
          }
        >
          Delete
        </Button>
      </Flex>
    </TouchElement>
  )
}

const TouchElement = styled.TouchableHighlight.attrs({
  underlayColor: color("white100"),
  activeOpacity: 0.8,
})``
