import { Box, Flex, Theme } from "@artsy/palette"
import React from "react"
import {
  ListView,
  ListViewDataSource,
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

import { PAGE_SIZE } from "lib/data/constants"

import { WorksForYou_query } from "__generated__/WorksForYou_query.graphql"
import Spinner from "lib/Components/Spinner"
import { ZeroState } from "lib/Components/States/ZeroState"
import Notification from "lib/Components/WorksForYou/Notification"
import colors from "lib/data/colors"
import { isCloseToBottom } from "lib/utils/isCloseToBottom"

interface Props {
  relay: RelayPaginationProp
  query: WorksForYou_query
}

interface State {
  dataSource: ListViewDataSource | null
  isRefreshing: boolean
  loadingContent: boolean
}

export class WorksForYou extends React.Component<Props, State> {
  // TODO: This `| any` is a hack workaround to a typing bug in https://github.com/artsy/emission/pull/504/
  scrollView?: ScrollView | any
  currentScrollOffset?: number = 0

  constructor(props: Props) {
    super(props)

    const notifications: object[] = this.props.query.me.followsAndSaves.notifications.edges.map(edge => edge.node)
    if (this.props.query.selectedArtist) {
      notifications.unshift(this.formattedSpecialNotification())
    }

    const dataSource = createDataSource(notifications)

    this.state = {
      dataSource,
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

  formattedSpecialNotification() {
    const artist = this.props.query.selectedArtist

    return {
      // This is just some unique ID, don’t rely on MP being able to retrieve a notification by this ID.
      id: `notification-${artist.slug}`,
      message: artist.artworks.edges.length + (artist.artworks.edges.length > 1 ? " Works Added" : " Work Added"),
      artists: artist.name,
      artworks: artist.artworks,
      image: {
        resized: {
          url: artist.image.resized.url,
        },
      },
      artistHref: artist.href,
    }
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

        const notifications: object[] = this.props.query.me.followsAndSaves.notifications.edges.map(edge => edge.node)

        // Make sure we maintain the special notification if it exists
        if (this.props.query.selectedArtist) {
          notifications.unshift(this.formattedSpecialNotification())
        }

        this.setState(
          {
            dataSource: this.state.dataSource.cloneWithRows(notifications),
          },
          () => {
            this.setState({ loadingContent: false })
          }
        )
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
      // update data source from scratch
      const notifications: object[] = this.props.query.me.followsAndSaves.notifications.edges.map(edge => edge.node)
      this.setState({ isRefreshing: false, dataSource: createDataSource(notifications) })
    })
  }

  render() {
    const hasNotifications = this.state.dataSource

    /* If showing the empty state, the ScrollView should have a {flex: 1} style so it can expand to fit the screen.
       otherwise, it should not use any flex growth.
    */
    return (
      <ScrollView
        contentContainerStyle={hasNotifications ? {} : styles.container}
        onScroll={isCloseToBottom(this.fetchNextPage)}
        scrollEventThrottle={100}
        ref={scrollView => (this.scrollView = scrollView)}
        refreshControl={<RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.handleRefresh} />}
      >
        <View style={{ flex: 1 }}>{hasNotifications ? this.renderNotifications() : this.renderEmptyState()}</View>
      </ScrollView>
    )
  }

  renderNotifications() {
    const { loadingContent } = this.state

    return (
      <Theme>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={data => <Notification notification={data} />}
          renderSeparator={(sectionID, rowID) =>
            <View key={`${sectionID}-${rowID}`} style={styles.separator} /> as React.ReactElement<{}>
          }
          renderFooter={() => (
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
          scrollEnabled={false}
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
          selectedArtist: { type: "String!", defaultValue: "" }
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
        selectedArtist: artist(id: $selectedArtist) {
          slug
          href
          name
          image {
            resized(height: 80, width: 80) {
              url
            }
          }
          artworks: artworksConnection(sort: PUBLISHED_AT_DESC, first: 6) {
            edges {
              node {
                ...GenericGrid_artworks
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

const createDataSource = (notifications: object[]) =>
  notifications.length &&
  new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }).cloneWithRows(notifications)

export default WorksForYouContainer
