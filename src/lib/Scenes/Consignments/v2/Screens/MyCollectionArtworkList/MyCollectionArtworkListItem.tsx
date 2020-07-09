import { Box, color, Flex, Sans } from "@artsy/palette"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import React from "react"
import { GestureResponderEvent } from "react-native"
import styled from "styled-components/native"

// TODO: Wire up to relay
export interface MyCollectionArtworkProps {
  id: string
  slug: string
  artistNames: string
  medium?: string
  image?: {
    url: string
  }
}

interface MyCollectionArtworkListItemProps {
  item: MyCollectionArtworkProps
  onPress: (event: GestureResponderEvent) => void
}

export const MyCollectionArtworkListItem: React.FC<MyCollectionArtworkListItemProps> = ({ item, onPress }) => {
  const imageURL = item.image?.url

  const Image = () =>
    !!imageURL ? (
      <OpaqueImageView imageURL={imageURL.replace(":version", "square")} width={90} height={90} />
    ) : (
      <Box bg={color("black30")} width={90} height={90} />
    )

  const Medium = () =>
    !!item.medium ? (
      <Sans size="3t" color="black60" numberOfLines={1}>
        {item.medium}
      </Sans>
    ) : null

  return (
    <TouchElement onPress={onPress}>
      <Flex m={1} flexDirection="row" alignItems="center">
        <Image />
        <Box mx={1}>
          <Sans size="4">{item.artistNames}</Sans>
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
