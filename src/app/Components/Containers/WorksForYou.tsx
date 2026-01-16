import * as Analytics from "@artsy/cohesion"
import { Flex, Box, Separator } from "@artsy/palette-mobile"
import { WorksForYouQuery } from "__generated__/WorksForYouQuery.graphql"
import { WorksForYou_me$data } from "__generated__/WorksForYou_me.graphql"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import Spinner from "app/Components/Spinner"
import { ZeroState } from "app/Components/States/ZeroState"
import Notification from "app/Components/WorksForYou/Notification"
import { PAGE_SIZE } from "app/Components/constants"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import { FlatList, RefreshControl, View } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"

interface Props {
  relay: RelayPaginationProp
  me: WorksForYou_me$data
}

export const WorksForYou: React.FC<Props> = ({ relay, me }) => {
  const tracking = useTracking()
  const containerRef = useRef<View>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [loadingContent, setLoadingContent] = useState(false)
  const [width, setWidth] = useState<number | null>(null)

  useLayoutEffect(() => {
    containerRef.current?.measureInWindow((_x, _y, measuredWidth) => {
      setWidth(measuredWidth)
    })
  }, [])

  useEffect(() => {
    // Update read status in gravity
    LegacyNativeModules.ARTemporaryAPIModule.markNotificationsRead((error) => {
      if (error) {
        console.warn(error)
      } else {
        tracking.trackEvent({
          name: "Notifications read",
          source_screen: Analytics.OwnerType.worksForYou,
        })
      }
    })
  }, [tracking])

  const fetchNextPage = () => {
    if (!relay.hasMore() || relay.isLoading()) {
      return
    }
    setLoadingContent(true)
    relay.loadMore(PAGE_SIZE, (error) => {
      if (error) {
        console.error("WorksForYou.tsx", error.message)
      }
      setLoadingContent(false)
    })
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    relay.refetchConnection(PAGE_SIZE, (error) => {
      if (error) {
        console.error("WorksForYou.tsx #handleRefresh", error.message)
      }
      setIsRefreshing(false)
    })
  }

  const notifications = extractNodes(me.followsAndSaves?.notifications)

  return (
    <PageWithSimpleHeader title="New Works for You">
      <View ref={containerRef} style={{ flex: 1 }}>
        <FlatList
          data={width === null ? [] : notifications}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
          renderItem={(data) => {
            return <Notification width={width ?? 0} notification={data.item} />
          }}
          onEndReached={fetchNextPage}
          ItemSeparatorComponent={() => (
            <Box px={2}>
              <Separator />
            </Box>
          )}
          ListFooterComponent={
            loadingContent
              ? () => (
                  <Box p={2} style={{ height: 50 }}>
                    <Flex style={{ flex: 1 }} flexDirection="row" justifyContent="center">
                      <Spinner />
                    </Flex>
                  </Box>
                )
              : null
          }
          ListEmptyComponent={
            width === null
              ? null
              : () => (
                  <ZeroState
                    title="You haven't followed any artists yet"
                    subtitle="Follow artists to see new works that have been added to Artsy."
                  />
                )
          }
        />
      </View>
    </PageWithSimpleHeader>
  )
}

export const WorksForYouContainer = createPaginationContainer(
  WorksForYou,
  {
    me: graphql`
      fragment WorksForYou_me on Me
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String" }
        sort: { type: "ArtworkSorts", defaultValue: PUBLISHED_AT_DESC }
      ) {
        followsAndSaves {
          notifications: bundledArtworksByArtistConnection(
            sort: $sort
            first: $count
            after: $cursor
          ) @connection(key: "WorksForYou_notifications") {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                id
                ...Notification_notification
              }
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.me.followsAndSaves?.notifications
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        // in most cases, for variables other than connection filters like
        // `first`, `after`, etc. you may want to use the previous values.
        ...fragmentVariables,
        count,
        cursor,
      }
    },
    query: graphql`
      query WorksForYouPaginationQuery($count: Int!, $cursor: String) {
        me {
          ...WorksForYou_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

export const WorksForYouScreenQuery = graphql`
  query WorksForYouQuery {
    me {
      ...WorksForYou_me
    }
  }
`
export const WorksForYouQueryRenderer: React.FC = () => {
  return (
    <QueryRenderer<WorksForYouQuery>
      environment={getRelayEnvironment()}
      query={WorksForYouScreenQuery}
      variables={{}}
      render={renderWithLoadProgress(WorksForYouContainer)}
    />
  )
}
