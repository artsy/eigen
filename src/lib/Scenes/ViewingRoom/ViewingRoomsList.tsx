import { Box, Flex, Sans, Separator, space, Spacer } from "@artsy/palette"
import { ViewingRoomsList_query$key } from "__generated__/ViewingRoomsList_query.graphql"
import { PAGE_SIZE } from "lib/data/constants"
import { extractNodes } from "lib/utils/extractNodes"
import { LoadingScreen } from "lib/utils/LoadingScreen"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import _ from "lodash"
import React from "react"
import { FlatList } from "react-native"
import { ConnectionConfig } from "react-relay"
import { graphql, usePagination, useQuery } from "relay-hooks"
import { ViewingRoomsListItem } from "./Components/ViewingRoomsListItem"

const FeaturedRail = () => <Box style={{ width: 80, height: 120, backgroundColor: "grey" }} />

const fragmentSpec = graphql`
  fragment ViewingRoomsList_query on Query @argumentDefinitions(count: { type: "Int" }, after: { type: "String" }) {
    viewingRooms(first: $count, after: $after) @connection(key: "ViewingRoomsList_viewingRooms") {
      edges {
        node {
          internalID
          ...ViewingRoomsListItem_item
        }
      }
    }
  }
`

const useNumColumns = () => {
  const { width, orientation } = useScreenDimensions()
  const isIPad = width > 700

  if (!isIPad) {
    return 1
  }

  return orientation === "portrait" ? 2 : 3
}

// keeps reloading more and more

interface ViewingRoomsListProps {
  query: ViewingRoomsList_query$key
}

export const ViewingRoomsListContainer: React.FC<ViewingRoomsListProps> = props => {
  const [queryData, { isLoading, hasMore, loadMore }] = usePagination(fragmentSpec, props.query)
  const viewingRooms = extractNodes(queryData.viewingRooms)

  const _loadMore = () => {
    if (!hasMore() || isLoading()) {
      return
    }
    loadMore(connectionConfig, PAGE_SIZE)
  }

  const numColumns = useNumColumns()

  return (
    <Flex flexDirection="column" justifyContent="space-between" height="100%">
      <Sans size="4t" weight="medium" textAlign="center" mb={1} mt={2}>
        Viewing Rooms
      </Sans>
      <Separator />
      {numColumns === 1 ? (
        <FlatList
          contentContainerStyle={{ marginHorizontal: space(2) }}
          ListHeaderComponent={() => (
            <>
              <Sans size="4t">Featured</Sans>
              <FeaturedRail />
              <Sans size="4t">Latest</Sans>
              <Spacer mt={1} />
            </>
          )}
          data={viewingRooms}
          keyExtractor={item => item.internalID}
          renderItem={({ item }) => <ViewingRoomsListItem item={item} />}
          ItemSeparatorComponent={() => <Spacer mt={3} />}
          onEndReached={_loadMore}
          onEndReachedThreshold={1}
        />
      ) : (
        <FlatList
          contentContainerStyle={{ marginHorizontal: space(2) }}
          ListHeaderComponent={() => (
            <>
              <Sans size="4t">Featured</Sans>
              <FeaturedRail />
              <Sans size="4t">Latest</Sans>
              <Spacer mt={1} />
            </>
          )}
          key={`${numColumns}`}
          numColumns={numColumns}
          data={viewingRooms}
          keyExtractor={item => `${item.internalID}-${numColumns}`}
          renderItem={({ item, index }) => (
            <>
              {index % numColumns > 0 && <Spacer ml={2} />}
              <Flex flex={1}>
                <ViewingRoomsListItem item={item} />
              </Flex>
            </>
          )}
          ItemSeparatorComponent={() => <Spacer mt={3} />}
          onEndReached={_loadMore}
          onEndReachedThreshold={1}
        />
      )}
    </Flex>
  )
}

const query = graphql`
  query ViewingRoomsListQuery($count: Int!, $after: String) {
    ...ViewingRoomsList_query @arguments(count: $count, after: $after)
  }
`

const connectionConfig: ConnectionConfig = {
  query,
  getVariables: (_props, { count, cursor }, _fragmentVariables) => ({
    count,
    after: cursor,
  }),
}

export const ViewingRoomsListQueryRenderer: React.FC = () => {
  const { props, error } = useQuery(query, { count: PAGE_SIZE })

  if (props) {
    return <ViewingRoomsListContainer query={props} />
  }
  if (error) {
    throw error
  }
  return <LoadingScreen />
}
