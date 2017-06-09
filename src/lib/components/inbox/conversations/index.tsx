import * as React from "react"
import * as Relay from "react-relay"

import { ListView, ListViewDataSource, ScrollView, Text, View } from "react-native"
import { LargeHeadline } from "../typography"

import ConversationSnippet from "./conversation_snippet"
import ZeroStateInbox from "./zerostateinbox"

const PageSize = 10

interface Props {
  me: any // we probably want to generate an interface for this
  relay: Relay.RelayProp
}

interface State {
  dataSource: ListViewDataSource | null
  fetchingNextPage: boolean
  completed: boolean
}

export class Conversations extends React.Component<Props, State> {
  currentScrollOffset?: number = 0

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

  get conversations() {
    return this.props.me.conversations.edges.map(a => a.node) || []
  }

  fetchNextPage() {
    if (this.state.fetchingNextPage || this.state.completed) {
      return
    }
    const totalSize = this.props.relay.variables.totalSize + PageSize

    this.setState({ fetchingNextPage: true })
    this.props.relay.setVariables({ totalSize }, readyState => {
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

  renderConversations() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={data => <ConversationSnippet conversation={data} />}
        onEndReached={() => this.fetchNextPage()}
        scrollEnabled={false}
      />
    )
  }

  renderInbox() {
    return (
      <ScrollView
        onScroll={event => (this.currentScrollOffset = event.nativeEvent.contentOffset.y)}
        scrollEventThrottle={10}
      >
        <LargeHeadline style={{ marginTop: 10 }}>Messages</LargeHeadline>
        {this.renderConversations()}
      </ScrollView>
    )
  }

  renderZeroState() {
    return  <ZeroStateInbox />
  }

  render() {
    const userHasConversations = this.props.me.conversations.edges.length > 0
    return (
      <View>
        {userHasConversations ? this.renderInbox() : this.renderZeroState()}
      </View>
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
              ${ConversationSnippet.getFragment("conversation")}
            }
          }
        }
      }
    `,
  },
})
