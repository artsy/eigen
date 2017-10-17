import React from "react"
import { ConnectionData, createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

import {
  LayoutChangeEvent,
  ListView,
  ListViewDataSource,
  NativeModules,
  ScrollView,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"

import Events from "../NativeModules/Events"

import GenericGrid from "../Components/ArtworkGrids/GenericGrid"
// tslint:disable-next-line:no-unused-expression
GenericGrid

import ZeroState from "lib/Components/States/ZeroState"
import SerifText from "lib/Components/Text/Serif"
import Notification from "lib/Components/WorksForYou/Notification"

import colors from "lib/data/colors"

const PageSize = 10

interface Props extends RelayProps {
  relay?: RelayPaginationProp
}

interface State {
  dataSource: ListViewDataSource | null
  fetchingNextPage: boolean
  completed: boolean
}

export class WorksForYou extends React.Component<Props, State> {
  // TODO: This `| any` is a hack workaround to a typing bug in https://github.com/artsy/emission/pull/504/
  scrollView?: ScrollView | any
  currentScrollOffset?: number = 0

  constructor(props: Props) {
    super(props)

    const notifications = this.props.viewer.me.notifications.edges.map(edge => edge.node)
    if (this.props.viewer.selectedArtist) {
      notifications.unshift(this.formattedSpecialNotification())
    }

    const dataSource =
      notifications.length &&
      new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }).cloneWithRows(notifications)

    this.state = {
      dataSource,
      completed: false,
      fetchingNextPage: false,
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

    // update anything in Eigen that relies on notification count
    NativeModules.ARWorksForYouModule.updateNotificationsCount(0)
  }

  formattedSpecialNotification() {
    const artist = this.props.viewer.selectedArtist

    return {
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

  fetchNextPage() {
    if (this.state.fetchingNextPage || this.state.completed) {
      return
    }
    this.setState({ fetchingNextPage: true })
    this.props.relay.loadMore(PageSize, error => {
      const notifications = this.props.viewer.me.notifications.edges.map(edge => edge.node)

      // Make sure we maintain the special notification if it exists
      if (this.props.viewer.selectedArtist) {
        notifications.unshift(this.formattedSpecialNotification())
      }

      this.setState({
        fetchingNextPage: false,
        dataSource: this.state.dataSource.cloneWithRows(notifications),
      })
      if (!this.props.viewer.me.notifications.pageInfo.hasNextPage) {
        this.setState({ completed: true })
      }
    })
  }

  componentDidUpdate() {
    this.scrollView.scrollTo({ y: this.currentScrollOffset + 1, animated: false })
  }

  render() {
    const hasNotifications = this.state.dataSource

    /* if showing the empty state, the ScrollView should have a {flex: 1} style so it can expand to fit the screen.
       otherwise, it should not use any flex growth.
    */
    return (
      <ScrollView
        contentContainerStyle={hasNotifications ? {} : styles.container}
        onScroll={event => (this.currentScrollOffset = event.nativeEvent.contentOffset.y)}
        scrollEventThrottle={100}
        ref={scrollView => (this.scrollView = scrollView)}
      >
        <View style={{ flex: 1 }}>
          {hasNotifications ? this.renderNotifications() : this.renderEmptyState()}
        </View>
      </ScrollView>
    )
  }

  renderNotifications() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={data => <Notification notification={data} />}
        renderSeparator={(sectionID, rowID) =>
          <View key={`${sectionID}-${rowID}`} style={styles.separator} /> as React.ReactElement<{}>}
        onEndReached={() => this.fetchNextPage()}
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
    viewer: graphql.experimental`
      fragment WorksForYou_viewer on Viewer
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String" }
          selectedArtist: { type: "String!", defaultValue: "" }
        ) {
        me {
          notifications: notifications_connection(first: $count, after: $cursor)
            @connection(key: "WorksForYou_notifications") {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                __id
                ...Notification_notification
              }
            }
          }
        }
        selectedArtist: artist(id: $selectedArtist) {
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
      return props.viewer.me.notifications as ConnectionData
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        // in most cases, for variables other than connection filters like
        // `first`, `after`, etc. you may want to use the previous values.
        ...fragmentVariables,
        count,
        cursor,
      }
    },
    query: graphql.experimental`
      query WorksForYouQuery($count: Int!, $cursor: String) {
        viewer {
          ...WorksForYou_viewer @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

export default WorksForYouContainer

interface RelayProps {
  viewer: {
    me: {
      notifications: {
        pageInfo: {
          hasNextPage: boolean
        }
        edges: Array<{
          node: any | null
        }>
      }
    }
    selectedArtist?: {
      name: string
      image: {
        resized: {
          url: string
        }
      } | null
      artworks: any[]
      href: string
    } | null
  }
}
