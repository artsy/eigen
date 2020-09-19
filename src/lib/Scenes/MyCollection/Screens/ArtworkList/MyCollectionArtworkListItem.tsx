import { MyCollectionArtworkListItem_artwork } from "__generated__/MyCollectionArtworkListItem_artwork.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { AppStore } from "lib/store/AppStore"
import { artworkMediumCategories } from "lib/utils/artworkMediumCategories"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { capitalize } from "lodash"
import { Box, color, Flex, Sans } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

interface MyCollectionArtworkListItemProps {
  artwork: MyCollectionArtworkListItem_artwork
}

export const MyCollectionArtworkListItem: React.FC<MyCollectionArtworkListItemProps> = ({ artwork }) => {
  const navActions = AppStore.actions.myCollection.navigation
  const imageURL = artwork?.image?.url
  const { width } = useScreenDimensions()
  const mediums: { [medium: string]: string } = artworkMediumCategories.reduce(
    (acc, cur) => ({ ...acc, [cur.value]: cur.label }),
    {}
  )

  const { artist, artistNames, medium, slug, title } = artwork

  const Image = () =>
    !!imageURL ? (
      <OpaqueImageView imageURL={imageURL.replace(":version", "square")} width={90} height={90} />
    ) : (
      <Box bg={color("black30")} width={90} height={90} />
    )

  const Medium = () =>
    !!medium ? (
      <Sans size="3t" color="black60" numberOfLines={1}>
        {mediums[medium] || capitalize(medium)}
      </Sans>
    ) : null

  const Title = () =>
    !!title ? (
      <Sans size="3t" color="black60" numberOfLines={1}>
        {title}
      </Sans>
    ) : null

  return (
    <TouchElement
      onPress={() =>
        navActions.navigateToArtworkDetail({
          artistInternalID: artist!.internalID,
          artworkSlug: slug,
          medium,
        })
      }
    >
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
            <Sans size="4">{artistNames}</Sans>
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
      artist {
        internalID
      }
      artistNames
      id
      internalID
      medium
      slug
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
