import React, { Component } from "react"
import { ConnectionData, createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import styled from "styled-components/native"

import { FlatList, View } from "react-native"
import { LargeHeadline } from "../Typography"

import { isCloseToBottom } from "lib/utils/isCloseToBottom"
import SwitchBoard from "../../../NativeModules/SwitchBoard"
import Spinner from "../../Spinner"
import ConversationSnippet from "./ConversationSnippet"

import { PAGE_SIZE } from "lib/data/constants"

import { Conversations_me } from "__generated__/Conversations_me.graphql"
import { get } from "lib/utils/get"

const Headline = styled(LargeHeadline)`
  margin-top: 20px;
  margin-bottom: -10px;
`

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

    if (!relay.isLoading()) {
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
    const conversations = get(this.props, ({ me }) => me.conversations.edges.map(edge => edge.node), [])

    return (
      <View>
        <View>
          {this.props.headerView}
          {conversations.length > 0 && <Headline>Messages</Headline>}
        </View>
        <FlatList
          data={conversations}
          keyExtractor={(_item, index) => String(index)}
          scrollEventThrottle={500}
          renderItem={({ item }) => {
            // TODO: What is up with this `as any`?
            //       there's a type mismatch here, as item above is a `ConversationSnippetProps`
            //       but conversation is a `ConversationSnippet_conversation`
            return (
              <ConversationSnippet
                conversation={item as any}
                onSelected={() => SwitchBoard.presentNavigationViewController(this, `conversation/${item.internalID}`)}
              />
            )
          }}
          onScroll={isCloseToBottom(this.fetchData)} // TODO: Investiate why onEndReached fires erroniously
        />
        {this.state.isLoading && <Spinner style={{ marginTop: 20, marginBottom: 20 }} />}
      </View>
    )
  }
}

export default createPaginationContainer(
  Conversations,
  {
    me: graphql`
      fragment Conversations_me on Me
        @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String", defaultValue: "" }) {
        conversations(first: $count, after: $cursor) @connection(key: "Conversations_conversations") {
          pageInfo {
            endCursor
            hasNextPage
          }
          edges {
            node {
              internalID
              last_message
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
      return props.me && (props.me.conversations as ConnectionData)
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
