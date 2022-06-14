import { ViewingRoomsList_viewingRooms$key } from "__generated__/ViewingRoomsList_viewingRooms.graphql"
import { ViewingRoomsListFeatured_featured$key } from "__generated__/ViewingRoomsListFeatured_featured.graphql"
import { ViewingRoomsListQuery } from "__generated__/ViewingRoomsListQuery.graphql"
import { PAGE_SIZE } from "app/Components/constants"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { SectionTitle } from "app/Components/SectionTitle"
import { extractNodes } from "app/utils/extractNodes"
import { PlaceholderBox, PlaceholderText, ProvidePlaceholderContext } from "app/utils/placeholders"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import _ from "lodash"
import { Flex, Spacer, useSpace } from "palette"
import React, { Suspense, useRef, useState } from "react"
import { FlatList, RefreshControl } from "react-native"
import { useLazyLoadQuery, usePaginationFragment } from "react-relay"
import { graphql, useFragment } from "react-relay"
import { useScreenDimensions } from "shared/hooks"
import { RailScrollRef } from "../Home/Components/types"
import { featuredFragment, FeaturedRail } from "./Components/ViewingRoomsListFeatured"
import { ViewingRoomsListItem } from "./Components/ViewingRoomsListItem"

const SCREEN_TITLE = "Viewing Rooms"

const fragmentSpec = graphql`
  fragment ViewingRoomsList_viewingRooms on Query
  @refetchable(queryName: "ViewingRoomsList_viewingRoomsRefetch")
  @argumentDefinitions(count: { type: "Int" }, after: { type: "String" }) {
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

export const ViewingRoomsListScreenQuery = graphql`
  query ViewingRoomsListQuery($count: Int!, $after: String) {
    ...ViewingRoomsList_viewingRooms @arguments(count: $count, after: $after)

    featured: viewingRooms(featured: true) {
      ...ViewingRoomsListFeatured_featured
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

export const ViewingRoomsList: React.FC = () => {
  const queryData = useLazyLoadQuery<ViewingRoomsListQuery>(
    ViewingRoomsListScreenQuery,
    viewingRoomsDefaultVariables
  )

  const space = useSpace()
  const { data, isLoadingNext, hasNext, loadNext, refetch } = usePaginationFragment<
    ViewingRoomsListQuery,
    ViewingRoomsList_viewingRooms$key
  >(fragmentSpec, queryData)
  const viewingRooms = extractNodes(data.viewingRooms)

  const featuredData = useFragment<ViewingRoomsListFeatured_featured$key>(
    featuredFragment,
    queryData.featured!
  )
  const featuredLength = extractNodes(featuredData).length

  const handleLoadMore = () => {
    if (!hasNext || isLoadingNext) {
      return
    }
    loadNext(PAGE_SIZE)
  }

  const [refreshing, setRefreshing] = useState(false)
  const handleRefresh = () => {
    setRefreshing(true)
    refetch({ count: PAGE_SIZE })
    setRefreshing(false)
    scrollRef.current?.scrollToTop()
  }

  const numColumns = useNumColumns()
  const scrollRef = useRef<RailScrollRef>(null)

  return (
    <ProvideScreenTracking info={tracks.screen()}>
      <PageWithSimpleHeader title={SCREEN_TITLE}>
        <Flex flexDirection="column" justifyContent="space-between" height="100%">
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
                    <FeaturedRail featured={queryData.featured!} scrollRef={scrollRef} />
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
                    {
                      /* right side separator*/ index % numColumns < numColumns - 1 && (
                        <Spacer mr="1" />
                      )
                    }
                    {
                      /* right list padding */ index % numColumns === numColumns - 1 && (
                        <Spacer mr="2" />
                      )
                    }
                  </Flex>
                )
              }
            }}
            ItemSeparatorComponent={() => <Spacer mt="3" />}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={1}
            ListFooterComponent={() =>
              hasNext ? <LoadingMorePlaceholder /> : <Flex height={space(6)} />
            }
          />
        </Flex>
      </PageWithSimpleHeader>
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

export const viewingRoomsDefaultVariables = { count: PAGE_SIZE, after: null }

const Placeholder = () => (
  <ProvidePlaceholderContext>
    <PageWithSimpleHeader title={SCREEN_TITLE}>
      <Spacer mb="2" />
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
            <PlaceholderText width={80 + Math.random() * 100} marginTop={5} />
          </React.Fragment>
        ))}
      </Flex>
    </PageWithSimpleHeader>
  </ProvidePlaceholderContext>
)

const LoadingMorePlaceholder = () => (
  <ProvidePlaceholderContext>
    <Flex mx="2" mt="4">
      {_.times(2).map((i) => (
        <React.Fragment key={i}>
          <PlaceholderBox width="100%" height={220} />
          <PlaceholderText width={120 + Math.random() * 100} marginTop={10} />
          <PlaceholderText width={80 + Math.random() * 100} marginTop={5} />
          <Spacer mb="3" />
        </React.Fragment>
      ))}
    </Flex>
  </ProvidePlaceholderContext>
)

export const ViewingRoomsListScreen: React.FC = () => (
  <Suspense fallback={<Placeholder />}>
    <ViewingRoomsList />
  </Suspense>
)
