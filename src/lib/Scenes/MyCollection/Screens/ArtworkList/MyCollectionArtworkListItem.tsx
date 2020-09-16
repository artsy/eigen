import { MyCollectionArtworkListItem_artwork } from "__generated__/MyCollectionArtworkListItem_artwork.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { formatMedium } from "lib/Scenes/MyCollection/utils/formatArtworkMedium"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, color, Flex, Sans } from "palette"
import React from "react"
import { GestureResponderEvent } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

interface MyCollectionArtworkListItemProps {
  artwork: MyCollectionArtworkListItem_artwork
  onPress: (event: GestureResponderEvent) => void
}

export const MyCollectionArtworkListItem: React.FC<MyCollectionArtworkListItemProps> = ({ artwork, onPress }) => {
  const imageURL = artwork?.image?.url
  const { width } = useScreenDimensions()

  const Image = () =>
    !!imageURL ? (
      <OpaqueImageView imageURL={imageURL.replace(":version", "square")} width={90} height={90} />
    ) : (
      <Box bg={color("black30")} width={90} height={90} />
    )

  const Medium = () =>
    !!artwork.medium ? (
      <Sans size="3t" color="black60" numberOfLines={1}>
        {formatMedium(artwork.medium)}
      </Sans>
    ) : null

  const Title = () =>
    !!artwork.title ? (
      <Sans size="3t" color="black60" numberOfLines={1}>
        {artwork.title}
      </Sans>
    ) : null

  return (
    <TouchElement onPress={onPress}>
      <Flex
        m={1}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        maxWidth={width}
        overflow="hidden"
      >
        <Flex flexDirection="row" alignItems="center">
          <Image />
          <Box mx={1} maxWidth={width}>
            <Sans size="4">{artwork.artistNames}</Sans>
            <Title />
            <Medium />
          </Box>
        </Flex>
      </Flex>
    </TouchElement>
  )
}

export const MyCollectionArtworkListItemFragmentContainer = createFragmentContainer(MyCollectionArtworkListItem, {
  artwork: graphql`
    fragment MyCollectionArtworkListItem_artwork on Artwork {
      id
      internalID
      slug
      artistNames
      medium
      title
      image {
        url
      }
    }
  `,
})

const TouchElement = styled.TouchableHighlight.attrs({
  underlayColor: color("white100"),
  activeOpacity: 0.8,
})``
