import { Box, Flex, Separator, Theme } from "@artsy/palette"
import { WorksForYou_query } from "__generated__/WorksForYou_query.graphql"
import Spinner from "lib/Components/Spinner"
import { ZeroState } from "lib/Components/States/ZeroState"
import Notification from "lib/Components/WorksForYou/Notification"
import colors from "lib/data/colors"
import { PAGE_SIZE } from "lib/data/constants"
import { get } from "lib/utils/get"
import { isCloseToBottom } from "lib/utils/isCloseToBottom"
import React from "react"
import {
  FlatList,
  NativeModules,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import Events from "../NativeModules/Events"

interface Props {
  relay: RelayPaginationProp
  query: WorksForYou_query
}

interface State {
  isRefreshing: boolean
  loadingContent: boolean
}

export class WorksForYou extends React.Component<Props, State> {
  currentScrollOffset?: number = 0

  constructor(props: Props) {
    super(props)

    this.state = {
      isRefreshing: false,
      loadingContent: false,
    }
  }

  componentDidMount() {
    // Update read status in gravity
    NativeModules.ARTemporaryAPIModule.markNotificationsRead(error => {
      if (error) {
        console.warn(error)
      } else {
        Events.postEvent({
          name: "Notifications read",
          source_screen: "works for you page",
        })
      }
    })
  }

  fetchNextPage = () => {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return
    }
    this.setState({ loadingContent: true }, () => {
      this.props.relay.loadMore(PAGE_SIZE, error => {
        if (error) {
          // FIXME: Handle error
          console.error("WorksForYou.tsx", error.message)
        }

        this.setState({ loadingContent: false })
      })
    })
  }

  handleRefresh = () => {
    this.setState({ isRefreshing: true })
    this.props.relay.refetchConnection(PAGE_SIZE, error => {
      if (error) {
        // FIXME: Handle error
        console.error("WorksForYou.tsx #handleRefresh", error.message)
      }
      this.setState({ isRefreshing: false })
    })
  }

  render() {
    const notifications = get(this.props, props => props.query.me.followsAndSaves.notifications.edges)
    const hasNotifications = notifications.length

    /* If showing the empty state, the ScrollView should have a {flex: 1} style so it can expand to fit the screen.
       otherwise, it should not use any flex growth.
    */
    return (
      <ScrollView
        contentContainerStyle={hasNotifications ? {} : styles.container}
        onScroll={isCloseToBottom(this.fetchNextPage)}
        scrollEventThrottle={100}
        refreshControl={<RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.handleRefresh} />}
      >
        <View style={{ flex: 1 }}>{hasNotifications ? this.renderNotifications() : this.renderEmptyState()}</View>
      </ScrollView>
    )
  }

  renderNotifications() {
    const { loadingContent } = this.state
    const notifications = get(this.props, props => props.query.me.followsAndSaves.notifications.edges)

    return (
      <Theme>
        <FlatList
          data={notifications}
          keyExtractor={item => item.node.id}
          scrollEnabled={false}
          renderItem={data => {
            return <Notification notification={data.item.node} />
          }}
          ItemSeparatorComponent={() => (
            <Box px={2}>
              <Separator />
            </Box>
          )}
          ListFooterComponent={() => (
            <>
              {loadingContent && (
                <Box p={2} style={{ height: 50 }}>
                  <Flex style={{ flex: 1 }} flexDirection="row" justifyContent="center">
                    <Spinner />
                  </Flex>
                </Box>
              )}
            </>
          )}
        />
      </Theme>
    )
  }

  renderEmptyState() {
    return (
      <ZeroState
        title="You haven’t followed any artists yet."
        subtitle="Follow artists to see new works that have been added to Artsy"
      />
    )
  }
}

interface Styles {
  container: ViewStyle
  title: TextStyle
  separator: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
  title: {
    marginTop: 20,
    fontSize: 20,
  },
  separator: {
    height: 1,
    backgroundColor: colors["gray-regular"],
  },
})

const WorksForYouContainer = createPaginationContainer(
  WorksForYou,
  {
    query: graphql`
      fragment WorksForYou_query on Query
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String" }
          sort: { type: "ArtworkSorts" }
        ) {
        me {
          followsAndSaves {
            notifications: bundledArtworksByArtistConnection(sort: PUBLISHED_AT_DESC, first: $count, after: $cursor)
              @connection(key: "WorksForYou_notifications") {
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
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.query.me.followsAndSaves.notifications
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
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
      query WorksForYouQuery($count: Int!, $cursor: String) {
        ...WorksForYou_query @arguments(count: $count, cursor: $cursor)
      }
    `,
  }
)

export default WorksForYouContainer
