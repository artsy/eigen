import React from "react"
import { ConnectionData, createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import styled from "styled-components/native"

import { PAGE_SIZE } from "lib/data/constants"
import { ListView, ListViewDataSource, View } from "react-native"
import { LargeHeadline } from "../Typography"

import { isCloseToBottom } from "lib/utils/isCloseToBottom"
import SwitchBoard from "../../../NativeModules/SwitchBoard"
import Spinner from "../../Spinner"
import ConversationSnippet from "./ConversationSnippet"

const Headline = styled(LargeHeadline)`
  margin-top: 20px;
  margin-bottom: -10px;
`

interface Props extends RelayProps {
  relay?: RelayPaginationProp
  headerView?: JSX.Element
  onRefresh?: () => any
}

interface State {
  dataSource: ListViewDataSource | null
  fetchingNextPage: boolean
}

export class Conversations extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const dataSource = new ListView.DataSource({
      rowHasChanged: (a, b) => a !== b,
    }).cloneWithRows(this.conversations)

    this.state = {
      dataSource,
      fetchingNextPage: false,
    }

    this.refreshConversations = this.refreshConversations.bind(this)
  }

  componentDidMount() {
    this.setState({
      dataSource: this.state.dataSource,
    })
  }

  componentWillReceiveProps(newProps) {
    const conversations = this.getConversationsFrom(newProps.me)

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(conversations),
    })
  }

  refreshConversations(callback) {
    if (this.state.fetchingNextPage) {
      return
    }

    this.setState({ fetchingNextPage: true })
    this.props.relay.refetchConnection(10, error => {
      if (error) {
        // FIXME: Handle error
        console.error("Conversations/index.jsx", error.message)
      }

      this.setState({
        fetchingNextPage: false,
      })

      if (callback) {
        callback()
      }
    })
  }

  hasContent() {
    if (!this.props.me) {
      return false
    }

    return this.props.me.conversations.edges.length > 0
  }

  get conversations() {
    return this.getConversationsFrom(this.props.me)
  }

  getConversationsFrom(me) {
    if (!me) {
      return []
    }

    const conversations = me.conversations.edges
      .filter(({ node }) => {
        return node && node.last_message
      })
      .map(edge => edge.node)

    return conversations || []
  }

  fetchData() {
    if (this.props.relay.isLoading()) {
      return
    }

    this.setState({
      fetchingNextPage: true,
    })

    this.props.relay.loadMore(PAGE_SIZE, error => {
      if (error) {
        // FIXME: Handle error
        console.error("Conversations/index.tsx", error.message)
      }

      this.setState({
        fetchingNextPage: false,
        dataSource: this.state.dataSource.cloneWithRows(this.conversations),
      })
    })
  }

  render() {
    const showLoadingSpinner = this.props.relay.hasMore()

    return (
      <View>
        <ListView
          dataSource={this.state.dataSource}
          initialListSize={10}
          scrollEventThrottle={500}
          enableEmptySections={true}
          renderHeader={() =>
            <View>
              {this.props.headerView}
              {this.hasContent() && <Headline>Messages</Headline>}
            </View>}
          renderRow={data =>
            <ConversationSnippet
              conversation={data}
              key={data.id}
              onSelected={() => SwitchBoard.presentNavigationViewController(this, `conversation/${data.id}`)}
            />}
          onScroll={isCloseToBottom(this.fetchData)} // TODO: Investiate why onEndReached fires erroniously
        />
        {showLoadingSpinner && <Spinner style={{ marginTop: 20 }} />}
      </View>
    )
  }
}

export default createPaginationContainer(
  Conversations,
  {
    me: graphql.experimental`
      fragment Conversations_me on Me
        @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String", defaultValue: "" }) {
        conversations(first: $count, after: $cursor) @connection(key: "Conversations_conversations") {
          pageInfo {
            endCursor
            hasNextPage
          }
          edges {
            node {
              id
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
    query: graphql.experimental`
      query ConversationsQuery($count: Int!, $cursor: String) {
        me {
          ...Conversations_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
) as React.ComponentClass<Props>

interface RelayProps {
  me: {
    conversations: {
      pageInfo: {
        hasNextPage: boolean
      } | null
      edges: Array<{
        node: {
          id: string | null
          last_message: string
        } | null
      } | null> | null
    } | null
  }
}
