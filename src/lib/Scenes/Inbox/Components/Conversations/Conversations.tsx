import React, { Component } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

import { ActivityIndicator, FlatList, RefreshControl, View } from "react-native"

import { navigate } from "lib/navigation/navigate"
import ConversationSnippet from "./ConversationSnippet"

import { PAGE_SIZE } from "lib/data/constants"

import { Conversations_me } from "__generated__/Conversations_me.graphql"
import { getCurrentEmissionState } from "lib/store/GlobalStore"
import { extractNodes } from "lib/utils/extractNodes"
import { color, Flex, Sans, Separator } from "palette"

interface Props {
  me: Conversations_me
  relay: RelayPaginationProp
  headerView?: JSX.Element
  onRefresh?: () => any
}

interface State {
  isLoading?: boolean
  fetching: boolean
}

export class Conversations extends Component<Props, State> {
  state = {
    isLoading: false,
    fetching: false,
  }

  fetchData = () => {
    const { relay } = this.props

    if (relay.hasMore() && !relay.isLoading()) {
      this.setState({
        isLoading: true,
      })
      relay.loadMore(PAGE_SIZE, (error) => {
        if (error) {
          console.error("Conversations/index.tsx #fetchData", error.message)
          // FIXME: Handle error
        }

        this.setState({
          isLoading: false,
        })
      })
    }
  }

  refreshConversations = (callback?: () => void) => {
    const { relay } = this.props
    if (!relay.isLoading()) {
      this.setState({ fetching: true })
      relay.refetchConnection(PAGE_SIZE, (error) => {
        if (error) {
          console.error("Conversations/index.tsx #refreshConversations", error.message)
          // FIXME: Handle error
        }
        if (callback) {
          callback()
        }
        this.setState({ fetching: false })
      })
    } else {
      if (callback) {
        callback()
      }
    }
  }

  render() {
    const conversations = extractNodes(this.props.me.conversations)

    if (conversations.length === 0) {
      return null
    }

    const unreadCount = this.props.me.conversations?.totalUnreadCount
    const unreadCounter = unreadCount ? `(${unreadCount})` : null
    const shouldDisplayMyBids = getCurrentEmissionState().options.AROptionsBidManagement

    return (
      <View>
        {!shouldDisplayMyBids && (
          <Flex py={1} style={{ borderBottomWidth: 1, borderBottomColor: color("black10") }}>
            <Sans mx={2} mt={1} size="8" style={{ borderBottomWidth: 1, borderBottomColor: color("black10") }}>
              Inbox {unreadCounter}
            </Sans>
          </Flex>
        )}
        <FlatList
          data={conversations}
          refreshControl={
            <RefreshControl
              refreshing={this.state.fetching}
              onRefresh={() => {
                this.refreshConversations()
              }}
            />
          }
          keyExtractor={(item) => item.internalID!}
          ItemSeparatorComponent={() => <Separator mx={2} width="auto" />}
          renderItem={({ item }) => {
            return (
              <ConversationSnippet conversation={item} onSelected={() => navigate(`conversation/${item.internalID}`)} />
            )
          }}
          onEndReached={this.fetchData}
          onEndReachedThreshold={2}
        />
        {!!(this.props.relay.hasMore() && this.state.isLoading) && (
          <Flex p={3} alignItems="center">
            <ActivityIndicator />
          </Flex>
        )}
      </View>
    )
  }
}

export const ConversationsContainer = createPaginationContainer(
  Conversations,
  {
    me: graphql`
      fragment Conversations_me on Me
      @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String", defaultValue: "" }) {
        conversations: conversationsConnection(first: $count, after: $cursor)
          @connection(key: "Conversations_conversations") {
          pageInfo {
            endCursor
            hasNextPage
          }
          edges {
            node {
              internalID
              last_message: lastMessage
              ...ConversationSnippet_conversation
            }
          }
          totalUnreadCount
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.me && props.me.conversations
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
      query ConversationsQuery($count: Int!, $cursor: String) {
        me {
          ...Conversations_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)
