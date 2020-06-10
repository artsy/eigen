import React, { Component } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

import { ActivityIndicator, FlatList, View } from "react-native"

import SwitchBoard from "../../../NativeModules/SwitchBoard"
import ConversationSnippet from "./ConversationSnippet"

import { PAGE_SIZE } from "lib/data/constants"

import { Flex, Serif, Spacer } from "@artsy/palette"
import { Conversations_me } from "__generated__/Conversations_me.graphql"
import { extractNodes } from "lib/utils/extractNodes"

interface Props {
  me: Conversations_me
  relay: RelayPaginationProp
  headerView?: JSX.Element
  onRefresh?: () => any
}

interface State {
  isLoading?: boolean
}

export class Conversations extends Component<Props, State> {
  state = {
    isLoading: false,
  }

  fetchData = () => {
    const { relay } = this.props

    if (relay.hasMore() && !relay.isLoading()) {
      this.setState({
        isLoading: true,
      })
      relay.loadMore(PAGE_SIZE, error => {
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
      relay.refetchConnection(PAGE_SIZE, error => {
        if (error) {
          console.error("Conversations/index.tsx #refreshConversations", error.message)
          // FIXME: Handle error
        }

        if (callback) {
          callback()
        }
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

    return (
      <View>
        <Serif m={2} size="8">
          Messages
        </Serif>
        <FlatList
          data={conversations}
          keyExtractor={item => item.internalID!}
          ItemSeparatorComponent={() => <Spacer mb={1} />}
          renderItem={({ item }) => {
            return (
              <ConversationSnippet
                conversation={item}
                onSelected={() => SwitchBoard.presentNavigationViewController(this, `conversation/${item.internalID}`)}
              />
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
        }
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.me && props.me.conversations
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
      query ConversationsQuery($count: Int!, $cursor: String) {
        me {
          ...Conversations_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)
