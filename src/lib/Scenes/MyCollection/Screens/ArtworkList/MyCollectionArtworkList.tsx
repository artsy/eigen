import { MyCollectionArtworkList_me } from "__generated__/MyCollectionArtworkList_me.graphql"
import { MyCollectionArtworkListQuery } from "__generated__/MyCollectionArtworkListQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { MyCollectionArtworkListItemFragmentContainer } from "lib/Scenes/MyCollection/Screens/ArtworkList/MyCollectionArtworkListItem"
import { AppStore } from "lib/store/AppStore"
import { extractNodes } from "lib/utils/extractNodes"
import { isCloseToBottom } from "lib/utils/isCloseToBottom"
import { PlaceholderBox, PlaceholderRaggedText, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Box, Flex, Join, Separator, Spacer, Text } from "palette"
import React from "react"
import { FlatList, View } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"

interface MyCollectionArtworkListProps {
  me: MyCollectionArtworkList_me
  relay: RelayPaginationProp
}

const PAGE_SIZE = 20

export const MyCollectionArtworkList: React.FC<MyCollectionArtworkListProps> = ({ me, relay }) => {
  const { navigation: navActions, artwork: artworkActions } = AppStore.actions.myCollection
  const artworks = extractNodes(me?.myCollectionConnection)
  const { hasMore, isLoading, loadMore } = relay

  const fetchNextPage = () => {
    if (!hasMore() || isLoading()) {
      return
    }

    loadMore(PAGE_SIZE!, (error) => {
      if (error) {
        throw new Error(`Error fetching artworks in MyCollectionArtworkList.tsx: ${error}`)
      }
    })
  }

  return (
    <View style={{ flex: 1 }}>
      <FancyModalHeader
        rightButtonText="Add artwork"
        hideBottomDivider
        onRightButtonPress={() => {
          // Store the global me.id identifier so that we know where to add / remove
          // edges after we add / remove artworks.
          // TODO: This can be removed once we update to relay 10 mutation API
          artworkActions.setMeGlobalId(me!.id)
          navActions.navigateToAddArtwork()
        }}
      ></FancyModalHeader>
      <Text variant="largeTitle" ml={2} mb={2}>
        Artwork Insights
      </Text>
      <FlatList
        data={artworks}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <Separator />}
        keyExtractor={(node) => node!.id}
        onScroll={isCloseToBottom(fetchNextPage)}
        renderItem={({ item }) => {
          return <MyCollectionArtworkListItemFragmentContainer artwork={item} />
        }}
      />
    </View>
  )
}

export const MyCollectionArtworkListContainer = createPaginationContainer(
  MyCollectionArtworkList,
  {
    me: graphql`
      fragment MyCollectionArtworkList_me on Me
      @argumentDefinitions(count: { type: "Int", defaultValue: 20 }, cursor: { type: "String" }) {
        id
        myCollectionConnection(first: $count, after: $cursor, sort: CREATED_AT_DESC)
        @connection(key: "MyCollectionArtworkList_myCollectionConnection", filters: []) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              slug
              ...MyCollectionArtworkListItem_artwork
            }
          }
        }
      }
    `,
  },
  {
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        count,
        cursor,
      }
    },
    query: graphql`
      query MyCollectionArtworkListPaginationQuery($count: Int!, $cursor: String) {
        me {
          ...MyCollectionArtworkList_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

export const MyCollectionArtworkListQueryRenderer: React.FC = () => {
  return (
    <QueryRenderer<MyCollectionArtworkListQuery>
      environment={defaultEnvironment}
      query={graphql`
        query MyCollectionArtworkListQuery {
          me {
            ...MyCollectionArtworkList_me
          }
        }
      `}
      variables={{}}
      render={renderWithPlaceholder({
        Container: MyCollectionArtworkListContainer,
        renderPlaceholder: LoadingSkeleton,
      })}
    />
  )
}

const LoadingSkeleton = () => {
  return (
    <>
      <Text variant="largeTitle" ml={2} mb={2}>
        Artwork Insights
      </Text>

      <Box>
        <Spacer mb={2} />

        {/* List items  */}
        <Flex flexDirection="column" pl={2}>
          <Join separator={<Spacer mr={0.5} />}>
            {[...new Array(8)].map((_, index) => {
              return (
                <Flex key={index} flexDirection="row" mb={1} alignItems="center">
                  <PlaceholderBox width={90} height={90} marginRight={10} />
                  <Box>
                    <PlaceholderText width={200} />
                    <PlaceholderRaggedText numLines={2} />
                  </Box>
                </Flex>
              )
            })}
          </Join>
        </Flex>
      </Box>
    </>
  )
}
