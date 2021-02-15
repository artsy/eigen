import { ViewingRoomsList_query$key } from "__generated__/ViewingRoomsList_query.graphql"
import { ViewingRoomsListFeatured_featured$key } from "__generated__/ViewingRoomsListFeatured_featured.graphql"
import { ViewingRoomsListQuery } from "__generated__/ViewingRoomsListQuery.graphql"
import { LoadFailureView } from "lib/Components/LoadFailureView"
import { SectionTitle } from "lib/Components/SectionTitle"
import { PAGE_SIZE } from "lib/data/constants"
import { extractNodes } from "lib/utils/extractNodes"
import { PlaceholderBox, PlaceholderText, ProvidePlaceholderContext } from "lib/utils/placeholders"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import _ from "lodash"
import { Flex, Sans, Separator, space, Spacer } from "palette"
import React, { useRef, useState } from "react"
import { FlatList, RefreshControl } from "react-native"
import { ConnectionConfig } from "react-relay"
import { graphql, useFragment, usePagination, useQuery } from "relay-hooks"
import { RailScrollRef } from "../Home/Components/types"
import { featuredFragment, FeaturedRail } from "./Components/ViewingRoomsListFeatured"
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

const useNumColumns = () => {
  const { width, orientation } = useScreenDimensions()
  const isIPad = width > 700

  if (!isIPad) {
    return 1
  }

  return orientation === "portrait" ? 2 : 3
}

interface ViewingRoomsListProps {
  query: ViewingRoomsList_query$key
  featured: ViewingRoomsListFeatured_featured$key
}

export const ViewingRoomsListContainer: React.FC<ViewingRoomsListProps> = (props) => {
  const [queryData, { isLoading, hasMore, loadMore, refetchConnection }] = usePagination(fragmentSpec, props.query)
  const viewingRooms = extractNodes(queryData.viewingRooms)

  const featuredData = useFragment(featuredFragment, props.featured)
  const featuredLength = extractNodes(featuredData).length

  const handleLoadMore = () => {
    if (!hasMore() || isLoading()) {
      return
    }
    loadMore(connectionConfig, PAGE_SIZE)
  }

  const [refreshing, setRefreshing] = useState(false)
  const handleRefresh = () => {
    setRefreshing(true)
    refetchConnection(connectionConfig, PAGE_SIZE)
    setRefreshing(false)
    scrollRef.current?.scrollToTop()
  }

  const numColumns = useNumColumns()
  const scrollRef = useRef<RailScrollRef>(null)

  return (
    <ProvideScreenTracking info={tracks.screen()}>
      <Flex flexDirection="column" justifyContent="space-between" height="100%">
        <Sans size="4t" weight="medium" textAlign="center" mb="1" mt="2">
          Viewing Rooms
        </Sans>
        <Separator />
        <FlatList
          numColumns={numColumns}
          key={`${numColumns}`}
          ListHeaderComponent={() => (
            <>
              <Spacer mt="2" />
              {featuredLength > 0 && (
                <>
                  <Flex mx="2">
                    <SectionTitle title="Featured" />
                  </Flex>
                  <FeaturedRail featured={props.featured} scrollRef={scrollRef} />
                  <Spacer mt="4" />
                </>
              )}
              <Flex mx="2">
                <SectionTitle title="Latest" />
              </Flex>
            </>
          )}
          data={viewingRooms}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          keyExtractor={(item) => `${item.internalID}-${numColumns}`}
          renderItem={({ item, index }) => {
            if (numColumns === 1) {
              return (
                <Flex mx="2">
                  <ViewingRoomsListItem item={item} />
                </Flex>
              )
            } else {
              return (
                <Flex flex={1 / numColumns} flexDirection="row">
                  {/* left list padding */ index % numColumns === 0 && <Spacer ml="2" />}
                  {/* left side separator */ index % numColumns > 0 && <Spacer ml="1" />}
                  <Flex flex={1}>
                    <ViewingRoomsListItem item={item} />
                  </Flex>
                  {/* right side separator*/ index % numColumns < numColumns - 1 && <Spacer mr="1" />}
                  {/* right list padding */ index % numColumns === numColumns - 1 && <Spacer mr="2" />}
                </Flex>
              )
            }
          }}
          ItemSeparatorComponent={() => <Spacer mt="3" />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={1}
          ListFooterComponent={() => (hasMore() ? <LoadingMorePlaceholder /> : <Flex height={space(6)} />)}
        />
      </Flex>
    </ProvideScreenTracking>
  )
}

const tracks = {
  screen: () => ({
    screen: Schema.PageNames.ViewingRoomsList,
    context_screen: Schema.PageNames.ViewingRoomsList,
    context_screen_owner_type: Schema.OwnerEntityTypes.ViewingRoom,
  }),
}

const query = graphql`
  query ViewingRoomsListQuery($count: Int!, $after: String) {
    ...ViewingRoomsList_query @arguments(count: $count, after: $after)

    featured: viewingRooms(featured: true) {
      ...ViewingRoomsListFeatured_featured
    }
  }
`

const connectionConfig: ConnectionConfig = {
  query,
  getVariables: (_props, { count, cursor }, _fragmentVariables) => ({
    count,
    after: cursor,
  }),
}

const Placeholder = () => (
  <ProvidePlaceholderContext>
    <PlaceholderText width={100 + Math.random() * 100} marginTop={30} alignSelf="center" />
    <Separator mt="1" mb="2" />
    <Flex ml="2">
      <PlaceholderText width={100 + Math.random() * 100} marginBottom={20} />
      <Flex flexDirection="row">
        {_.times(4).map((i) => (
          <PlaceholderBox key={i} width={280} height={370} marginRight={15} />
        ))}
      </Flex>
    </Flex>
    <Flex mx="2" mt="4">
      <PlaceholderText width={100 + Math.random() * 100} marginBottom={20} />
      {_.times(2).map((i) => (
        <React.Fragment key={i}>
          <PlaceholderBox width="100%" height={220} />
          <PlaceholderText width={120 + Math.random() * 100} marginTop={10} />
          <PlaceholderText width={80 + Math.random() * 100} marginTop="5" />
        </React.Fragment>
      ))}
    </Flex>
  </ProvidePlaceholderContext>
)

const LoadingMorePlaceholder = () => (
  <ProvidePlaceholderContext>
    <Flex mx="2" mt="4">
      {_.times(2).map((i) => (
        <React.Fragment key={i}>
          <PlaceholderBox width="100%" height={220} />
          <PlaceholderText width={120 + Math.random() * 100} marginTop={10} />
          <PlaceholderText width={80 + Math.random() * 100} marginTop="5" />
          <Spacer mb="3" />
        </React.Fragment>
      ))}
    </Flex>
  </ProvidePlaceholderContext>
)

export const ViewingRoomsListQueryRenderer: React.FC = () => {
  const { props, error, retry } = useQuery<ViewingRoomsListQuery>(query, { count: PAGE_SIZE })

  if (props) {
    return <ViewingRoomsListContainer query={props} featured={props.featured!} />
  }
  if (error) {
    console.error(error)
    return <LoadFailureView onRetry={retry} style={{ flex: 1 }} />
  }

  return <Placeholder />
}
