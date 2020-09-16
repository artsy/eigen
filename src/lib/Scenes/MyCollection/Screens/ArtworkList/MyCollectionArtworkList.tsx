import { Sans, Separator } from "palette"
import React from "react"
import { FlatList, TouchableOpacity } from "react-native"

import {
  MyCollectionArtworkListQuery,
  MyCollectionArtworkListQueryResponse,
} from "__generated__/MyCollectionArtworkListQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { AppStore } from "lib/store/AppStore"
import { extractNodes } from "lib/utils/extractNodes"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { graphql, QueryRenderer } from "react-relay"
import { MyCollectionArtworkListItemFragmentContainer as MyCollectionArtworkListItem } from "./MyCollectionArtworkListItem"

interface MyCollectionArtworkListProps {
  me: MyCollectionArtworkListQueryResponse["me"]
}

export const MyCollectionArtworkList: React.FC<MyCollectionArtworkListProps> = props => {
  const { navigation: navActions, artwork: artworkActions } = AppStore.actions.myCollection

  return (
    <FlatList
      ListHeaderComponent={() => {
        return (
          <>
            <TouchableOpacity
              style={{ alignSelf: "flex-end" }}
              onPress={() => {
                navActions.navigateToAddArtwork()

                // Store the global me.id identifier so that we know where to add / remove
                // edges after we add / remove artworks.
                // TODO: This can be removed once we update to relay 10 mutation API
                artworkActions.setMeGlobalId(props!.me!.id)
              }}
            >
              <Sans size="3" m={2}>
                Add artwork
              </Sans>
            </TouchableOpacity>
            <Sans ml={2} mb={2} size="8">
              Artwork Insights
            </Sans>
          </>
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

export const MyCollectionArtworkListQueryRenderer: React.FC = () => {
  return (
    <QueryRenderer<MyCollectionArtworkListQuery>
      environment={defaultEnvironment}
      query={graphql`
        query MyCollectionArtworkListQuery {
          me {
            id
            myCollectionConnection(first: 90)
              @connection(key: "MyCollectionArtworkList_myCollectionConnection", filters: []) {
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
      `}
      variables={{}}
      // TODO: Need to add <Skeleton> stuff
      render={renderWithLoadProgress(MyCollectionArtworkList)}
    />
  )
}
