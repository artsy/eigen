import { Box, color, Flex, Sans, Separator } from "@artsy/palette"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import React from "react"
import { FlatList, GestureResponderEvent } from "react-native"
import styled from "styled-components/native"
import { useStoreActions } from "../../State/hooks"

export const MyCollectionArtworkList = () => {
  const navActions = useStoreActions(actions => actions.navigation)

  return (
    <FlatList
      ListHeaderComponent={() => {
        return (
          <>
            <Box m={2}>
              <Sans size="8">Your collection</Sans>
            </Box>
          </>
        )
      }}
      data={myArtworks}
      ItemSeparatorComponent={() => <Separator />}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <MyCollectionArtworkListItem item={item} onPress={() => navActions.navigateToArtworkDetail(item.id)} />
      )}
    />
  )
}

const TouchElement = styled.TouchableHighlight.attrs({ underlayColor: color("white100"), activeOpacity: 0.8 })``

interface MyCollectionArtworkListItemProps {
  item: MyCollectionArtwork
  onPress: ((event: GestureResponderEvent) => void) | undefined
}
const MyCollectionArtworkListItem: React.FC<MyCollectionArtworkListItemProps> = ({ item, onPress }) => {
  const imageURL = item.image?.url
  const imageDisplay = !!imageURL ? (
    <OpaqueImageView
      imageURL={imageURL.replace(":version", "square")}
      width={90}
      height={90}
      // style={{ borderRadius: 2, overflow: "hidden" }}
    />
  ) : (
    <Box
      bg={color("black30")}
      width={90}
      height={90}
      // style={{ borderRadius: 2 }}
    />
  )

  const mediumDisplay = !!item.medium ? (
    <Sans size="3t" color="black60" numberOfLines={1}>
      {item.medium}
    </Sans>
  ) : null

  return (
    <TouchElement onPress={onPress}>
      <Flex m={1} flexDirection="row" alignItems="center">
        {imageDisplay}
        <Box mx={1}>
          <Sans size="4">{item.artistNames}</Sans>
          {mediumDisplay}
        </Box>
      </Flex>
    </TouchElement>
  )
}

// Everything below here will be replaced when we're connected to real data

interface MyCollectionArtwork {
  id: string
  slug: string
  artistNames: string
  medium?: string
  image?: {
    url: string
  }
}

const myArtworks: MyCollectionArtwork[] = [
  {
    id: "1",
    slug: "my-artwork/1",
    artistNames: "Andy Goldsworthy",
    medium: "Photography",
    image: {
      url: "https://d32dm0rphc51dk.cloudfront.net/XfpWAbjogvTja0baxOk2eg/square.jpg",
    },
  },
  {
    id: "2",
    slug: "my-artwork/2",
    artistNames: "Andy Warhol",
    medium: "Dry Erase markers",
    image: {
      url: "https://d32dm0rphc51dk.cloudfront.net/DkpNiCKRYoqa7BXEtsZSpQ/square.jpg",
    },
  },
  {
    id: "3",
    slug: "my-artwork/3",
    artistNames: "James Rosenquist",
    medium: "Cat hair",
  },
  {
    id: "4",
    slug: "my-artwork/4",
    artistNames: "Banksy",
    medium: "Pastels",
    image: {
      url: "https://d32dm0rphc51dk.cloudfront.net/ng_LZVBhBb2805HMUIl6UQ/square.jpg",
    },
  },
]
