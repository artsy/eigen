import { Box, Flex, Sans, Separator, Spacer } from "@artsy/palette"
import { ViewingRoomsList_query } from "__generated__/ViewingRoomsList_query.graphql"
import { PAGE_SIZE } from "lib/data/constants"
import { extractNodes } from "lib/utils/extractNodes"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import _ from "lodash"
import React from "react"
import { Button, FlatList, ScrollView } from "react-native"
import { ConnectionConfig } from "react-relay"
import { graphql, usePagination, useQuery } from "relay-hooks"
import { ViewingRoomsListItem } from "./Components/ViewingRoomsListItem"

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

interface ViewingRoomsListProps {
  // relay: RelayPaginationProp
  query: ViewingRoomsList_query
}

export const ViewingRoomsList: React.FC<ViewingRoomsListProps> = props => {
  const [queryData, { isLoading, hasMore, loadMore }]: [string[], any] = usePagination(fragmentSpec, props.query)
  const extracted = extractNodes(queryData.viewingRooms)

  const _loadMore = () => {
    if (!hasMore()) {
      console.log("no more")
      return
    } else if (isLoading()) {
      console.log("loading already")
      return
    }

    loadMore(connectionConfig, PAGE_SIZE, error => void console.log(error), {})
  }

  // return (
  //   <ScrollView>
  //     <Sans size="2">wow2</Sans>
  //     <Sans size="2">wow1</Sans>
  //     <Sans size="2">wow2</Sans>
  //     <Sans size="2">wow1</Sans>
  //     {extracted.map(item => (
  //       <Sans size="4">
  //         {item.status} {item.title}
  //       </Sans>
  //     ))}
  //     {/* <Sans size="5">{JSON.stringify(items)}</Sans> */}
  //     <Button title="load more" onPress={() => void _loadMore()} />
  //   </ScrollView>
  // )

  const viewingRoomsToDisplay = extracted

  return (
    <Flex flexDirection="column" justifyContent="space-between" height="100%">
      <Sans size="4t" weight="medium" textAlign="center" mb={1} mt={2}>
        Viewing Rooms
      </Sans>
      <Separator />
      <ScrollView>
        <Flex px="2">
          <Sans size="4t">Featured</Sans>
          <Box style={{ width: 80, height: 120, backgroundColor: "grey" }} />
          <Sans size="4t">Latest</Sans>
          <Spacer mt={1} />
          <FlatList
            data={viewingRoomsToDisplay}
            keyExtractor={item => item.internalID}
            renderItem={({ item }) => <ViewingRoomsListItem item={item} />}
            ItemSeparatorComponent={() => <Spacer mt={3} />}
            // onEndReached={_loadMore}
          />
          <Button onPress={_loadMore} title="more" />
        </Flex>
      </ScrollView>
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
  // getConnectionFromProps: props => props.viewingRooms,
  // getFragmentVariables: (prevVars, totalCount) => {
  //   console.log("getfrag")
  //   console.log({ prevVars, totalCount })
  //   return {
  //     ...prevVars,
  //     count: totalCount,
  //   }
  // },
  getVariables: (props, { count, cursor }, fragmentVariables) => {
    console.log("getvar")
    console.log(props)
    console.log({ count, cursor, fragmentVariables })
    return {
      // ...fragmentVariables,
      count,
      after: cursor,
    }
  },
}

//       render={renderWithLoadProgress(ViewingRoomsListPaginationContainer)}

export const ViewingRoomsListQueryRenderer: React.FC = () => {
  const { props, error, retry, cached } = useQuery(query, { count: PAGE_SIZE })

  if (props) {
    return <ViewingRoomsList query={props} />
  } else if (error) {
    return <Sans size="3">ERROR {error.message}</Sans>
  }
  return (
    <ScrollView>
      <Sans size="4">loading {JSON.stringify(props)}</Sans>
    </ScrollView>
  )
}

/// @connection probably goes only in fragment. so we cant do in query here
