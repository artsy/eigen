import { Box, Button, Sans, Separator, Spacer } from "@artsy/palette"
import React from "react"
import { FlatList } from "react-native"
import { useStoreActions } from "../../State/hooks"

import { MyCollectionArtworkListItem, MyCollectionArtworkProps } from "./MyCollectionArtworkListItem"

export const MyCollectionArtworkList = () => {
  const navActions = useStoreActions(actions => actions.navigation)

  return (
    <FlatList
      ListHeaderComponent={() => {
        return (
          <Box m={2} mt={4}>
            <Sans size="8">Your collection</Sans>
            <Spacer my={1} />
            <Button block onPress={navActions.navigateToAddArtwork}>
              Add artwork
            </Button>
          </Box>
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

const myArtworks: MyCollectionArtworkProps[] = [
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
