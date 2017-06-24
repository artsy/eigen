import * as React from "react"
import * as Relay from "react-relay"
import styled from "styled-components/native"

import { ListView, ListViewDataSource, RefreshControl, ScrollView, Text, View } from "react-native"
import { LargeHeadline } from "../Typography"

import SwitchBoard from "../../../NativeModules/SwitchBoard"
import ConversationSnippet from "./ConversationSnippet"

const PageSize = 6

const Headline = styled(LargeHeadline)`
  margin-top: 10px;
  margin-bottom: 20px;
`

interface Props {
  me: any // we probably want to generate an interface for this
  relay: Relay.RelayProp
  headerView?: JSX.Element
}

interface State {
  dataSource: ListViewDataSource | null
  fetchingNextPage: boolean
  completed: boolean
}

export class Conversations extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    const dataSource = new ListView.DataSource({
      rowHasChanged: (a, b) => a !== b,
    }).cloneWithRows(this.conversations)

    this.state = {
      dataSource,
      completed: false,
      fetchingNextPage: false,
    }
  }

  componentDidMount() {
    this.setState({
      dataSource: this.state.dataSource,
    })
  }

  componentWillReceiveProps(newProps) {
    console.log(newProps)

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.getConversationsFrom(newProps.me)),
    })
  }

  get conversations() {
    return this.getConversationsFrom(this.props.me)
  }

  getConversationsFrom(me) {
    const conversations = me.conversations.edges
      .filter(({ node }) => {
        return node.last_message
      })
      .map(edge => edge.node)
    return conversations || []
  }

  fetchNextPage() {
    if (this.state.fetchingNextPage || this.state.completed) {
      return
    }
    const totalSize = this.props.relay.variables.totalSize + PageSize

    this.setState({ fetchingNextPage: true })
    this.props.relay.forceFetch({ totalSize }, readyState => {
      if (readyState.done) {
        this.setState({
          fetchingNextPage: false,
          dataSource: this.state.dataSource.cloneWithRows(this.conversations),
        })

        if (!this.props.me.conversations.pageInfo.hasNextPage) {
          this.setState({ completed: true })
        }
      }
    })
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        initialListSize={10}
        scrollEventThrottle={10}
        onEndReachedThreshold={10}
        refreshControl={
          <RefreshControl refreshing={this.state.fetchingNextPage} onRefresh={this.fetchNextPage.bind(this)} />
        }
        renderHeader={() => {
          return (
            <View>
              {this.props.headerView}
              <Headline>Messages</Headline>
            </View>
          )
        }}
        renderRow={data =>
          <ConversationSnippet
            conversation={data}
            key={data.id}
            onSelected={() => SwitchBoard.presentNavigationViewController(this, `conversation/${data.id}`)}
          />}
        onEndReached={() => this.fetchNextPage()}
      />
    )
  }
}

export default Relay.createContainer(Conversations, {
  initialVariables: {
    totalSize: PageSize,
  },
  fragments: {
    me: () => Relay.QL`
      fragment on Me {
        conversations(first: $totalSize) {
          pageInfo {
            hasNextPage
          }
          edges {
            node {
              id
              last_message
              ${ConversationSnippet.getFragment("conversation")}
            }
          }
        }
      }
    `,
  },
})
