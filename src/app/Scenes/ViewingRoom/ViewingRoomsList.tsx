import { Spacer, Flex, useSpace } from "@artsy/palette-mobile"
import { ViewingRoomsListFeatured_featured$key } from "__generated__/ViewingRoomsListFeatured_featured.graphql"
import { ViewingRoomsListQuery } from "__generated__/ViewingRoomsListQuery.graphql"
import { ViewingRoomsList_viewingRooms$key } from "__generated__/ViewingRoomsList_viewingRooms.graphql"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { SectionTitle } from "app/Components/SectionTitle"
import { PAGE_SIZE } from "app/Components/constants"
import { RailScrollRef } from "app/Scenes/Home/Components/types"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/hooks"
import { PlaceholderBox, PlaceholderText, ProvidePlaceholderContext } from "app/utils/placeholders"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { times } from "lodash"
import { Fragment, Suspense, useRef, useState } from "react"
import { FlatList, RefreshControl } from "react-native"
import { useLazyLoadQuery, usePaginationFragment, graphql, useFragment } from "react-relay"
import { featuredFragment, FeaturedRail } from "./Components/ViewingRoomsListFeatured"
import { ViewingRoomsListItem } from "./Components/ViewingRoomsListItem"

const SCREEN_TITLE = "Viewing Rooms"

const fragmentSpec = graphql`
  fragment ViewingRoomsList_viewingRooms on Query
  @refetchable(queryName: "ViewingRoomsList_viewingRoomsRefetch")
  @argumentDefinitions(count: { type: "Int" }, after: { type: "String" }) {
    viewingRoomsConnection(first: $count, after: $after)
      @connection(key: "ViewingRoomsList_viewingRoomsConnection") {
      edges {
        node {
          internalID
          ...ViewingRoomsListItem_item
        }
      }
    }
  }
`

export const viewingRoomsListScreenQuery = graphql`
  query ViewingRoomsListQuery($count: Int!, $after: String) {
    ...ViewingRoomsList_viewingRooms @arguments(count: $count, after: $after)

    featured: viewingRoomsConnection(featured: true) {
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

export const ViewingRoomsList = () => {
  const space = useSpace()

  const queryData = useLazyLoadQuery<ViewingRoomsListQuery>(viewingRoomsListScreenQuery, {
    count: PAGE_SIZE,
    after: null,
  })

  const { data, isLoadingNext, hasNext, loadNext, refetch } = usePaginationFragment<
    ViewingRoomsListQuery,
    ViewingRoomsList_viewingRooms$key
  >(fragmentSpec, queryData)
  const viewingRooms = extractNodes(data.viewingRoomsConnection)

  const featuredData = useFragment<ViewingRoomsListFeatured_featured$key>(
    featuredFragment,
    queryData.featured
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
                <Spacer y={2} />
                {featuredLength > 0 && (
                  <>
                    <Flex mx={2}>
                      <SectionTitle title="Featured" />
                    </Flex>
                    <FeaturedRail featured={queryData.featured} scrollRef={scrollRef} />
                    <Spacer y={4} />
                  </>
                )}
                <Flex mx={2}>
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
                  <Flex mx={2}>
                    <ViewingRoomsListItem item={item} />
                  </Flex>
                )
              } else {
                return (
                  <Flex flex={1 / numColumns} flexDirection="row">
                    {/* left list padding */ index % numColumns === 0 && <Spacer x={2} />}
                    {/* left side separator */ index % numColumns > 0 && <Spacer x={1} />}
                    <Flex flex={1}>
                      <ViewingRoomsListItem item={item} />
                    </Flex>
                    {
                      /* right side separator*/ index % numColumns < numColumns - 1 && (
                        <Spacer x={1} />
                      )
                    }
                    {
                      /* right list padding */ index % numColumns === numColumns - 1 && (
                        <Spacer x={2} />
                      )
                    }
                  </Flex>
                )
              }
            }}
            ItemSeparatorComponent={() => <Spacer y={4} />}
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

const Placeholder = () => (
  <ProvidePlaceholderContext>
    <PageWithSimpleHeader title={SCREEN_TITLE}>
      <Spacer y={2} />
      <Flex ml={2} testID="viewing-rooms-list-placeholder">
        <PlaceholderText width={100 + Math.random() * 100} marginBottom={20} />
        <Flex flexDirection="row">
          {times(4).map((i) => (
            <PlaceholderBox key={i} width={280} height={370} marginRight={15} />
          ))}
        </Flex>
      </Flex>
      <Flex mx={2} mt={4}>
        <PlaceholderText width={100 + Math.random() * 100} marginBottom={20} />
        {times(2).map((i) => (
          <Fragment key={i}>
            <PlaceholderBox width="100%" height={220} />
            <PlaceholderText width={120 + Math.random() * 100} marginTop={10} />
            <PlaceholderText width={80 + Math.random() * 100} marginTop={6} />
          </Fragment>
        ))}
      </Flex>
    </PageWithSimpleHeader>
  </ProvidePlaceholderContext>
)

const LoadingMorePlaceholder = () => (
  <ProvidePlaceholderContext>
    <Flex mx={2} mt={4}>
      {times(2).map((i) => (
        <Fragment key={i}>
          <PlaceholderBox width="100%" height={220} />
          <PlaceholderText width={120 + Math.random() * 100} marginTop={10} />
          <PlaceholderText width={80 + Math.random() * 100} marginTop={6} />
          <Spacer y={4} />
        </Fragment>
      ))}
    </Flex>
  </ProvidePlaceholderContext>
)

export const ViewingRoomsListScreen = () => (
  <Suspense fallback={<Placeholder />}>
    <ViewingRoomsList />
  </Suspense>
)
