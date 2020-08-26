import { Box, Button, Sans, Separator, Spacer } from "palette"
import React from "react"
import { FlatList } from "react-native"

import { MyCollectionArtworkListQuery } from "__generated__/MyCollectionArtworkListQuery.graphql"
import { AppStore } from "lib/store/AppStore"
import { extractNodes } from "lib/utils/extractNodes"
import { graphql, useQuery } from "relay-hooks"
import { MyCollectionArtworkListItem } from "./MyCollectionArtworkListItem"

export const MyCollectionArtworkList: React.FC = () => {
  const navActions = AppStore.actions.myCollection.navigation
  const { props, error } = useQuery<MyCollectionArtworkListQuery>(graphql`
    query MyCollectionArtworkListQuery {
      me {
        myCollectionConnection(first: 10) {
          edges {
            node {
              id
              slug
              ...MyCollectionArtworkListItem_artwork
            }
          }
        }
      }
    }
  `)

  if (!props) {
    // FIXME: Add Skeleton
    return null
  }
  if (error) {
    // FIXME: handle error
    throw error
  }

  return (
    <FlatList
      ListHeaderComponent={() => {
        return (
          <Box m={2} mt={4}>
            <Sans size="8">Your collection</Sans>
            <Spacer my={1} />
            <Button block onPress={() => navActions.navigateToAddArtwork()}>
              Add artwork
            </Button>
          </Box>
        )
      }}
      data={extractNodes(props.me?.myCollectionConnection)}
      ItemSeparatorComponent={() => <Separator />}
      keyExtractor={node => node!.id}
      renderItem={({ item }) => {
        return (
          <MyCollectionArtworkListItem artwork={item} onPress={() => navActions.navigateToArtworkDetail(item.slug)} />
        )
      }}
    />
  )
}
