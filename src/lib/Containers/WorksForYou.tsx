import React from "react"
import { ConnectionData, createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

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

import Events from "../NativeModules/Events"

import { PAGE_SIZE } from "lib/data/constants"

import ZeroState from "lib/Components/States/ZeroState"
import Notification from "lib/Components/WorksForYou/Notification"
import colors from "lib/data/colors"
import { isCloseToBottom } from "lib/utils/isCloseToBottom"

import { WorksForYou_viewer } from "__generated__/WorksForYou_viewer.graphql"

interface Props {
  relay: RelayPaginationProp
  viewer: WorksForYou_viewer
}

interface State {
  dataSource: ListViewDataSource | null
  isRefreshing: boolean
}

export class WorksForYou extends React.Component<Props, State> {
  // TODO: This `| any` is a hack workaround to a typing bug in https://github.com/artsy/emission/pull/504/
  scrollView?: ScrollView | any
  currentScrollOffset?: number = 0

  constructor(props: Props) {
    super(props)

    const notifications: object[] = this.props.viewer.me.followsAndSaves.notifications.edges.map(edge => edge.node)
    if (this.props.viewer.selectedArtist) {
      notifications.unshift(this.formattedSpecialNotification())
    }

    const dataSource =
      notifications.length &&
      new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }).cloneWithRows(notifications)

    this.state = {
      dataSource,
      isRefreshing: false,
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
    const artist = this.props.viewer.selectedArtist

    return {
      // This is just some unique ID, don’t rely on MP being able to retrieve a notification by this ID.
      id: `notification-${artist.gravityID}`,
      message: artist.artworks.length + (artist.artworks.length > 1 ? " Works Added" : " Work Added"),
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
    this.props.relay.loadMore(PAGE_SIZE, error => {
      if (error) {
        // FIXME: Handle error
        console.error("WorksForYou.tsx", error.message)
      }

      const notifications: object[] = this.props.viewer.me.followsAndSaves.notifications.edges.map(edge => edge.node)

      // Make sure we maintain the special notification if it exists
      if (this.props.viewer.selectedArtist) {
        notifications.unshift(this.formattedSpecialNotification())
      }

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(notifications),
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
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={data => <Notification notification={data} />}
        renderSeparator={(sectionID, rowID) =>
          <View key={`${sectionID}-${rowID}`} style={styles.separator} /> as React.ReactElement<{}>
        }
        scrollEnabled={false}
      />
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
    viewer: graphql`
      fragment WorksForYou_viewer on Viewer
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String" }
          selectedArtist: { type: "String!", defaultValue: "" }
          sort: { type: "ArtworkSorts" }
        ) {
        me {
          followsAndSaves {
            notifications: bundledArtworksByArtist(sort: PUBLISHED_AT_DESC, first: $count, after: $cursor)
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
          gravityID
          href
          name
          image {
            resized(height: 80, width: 80) {
              url
            }
          }
          artworks(sort: published_at_desc, size: 6) {
            ...GenericGrid_artworks
          }
        }
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.viewer.me.followsAndSaves.notifications as ConnectionData
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
        viewer {
          ...WorksForYou_viewer @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

export default WorksForYouContainer
