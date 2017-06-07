import * as React from "react"
import * as Relay from "react-relay"

import {
  ListView,
  ListViewDataSource,
  ScrollView,
} from "react-native"
import { LargeHeadline } from "../typography"

import ConversationSnippet from "./conversation_snippet"

const PageSize = 10

interface State {
  dataSource: ListViewDataSource | null
  fetchingNextPage: boolean
  completed: boolean
}

export class Conversations extends React.Component<any, State> {
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
    this.props.relay.setVariables({totalSize}, readyState => {
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

  render() {
    return (
      <ScrollView onScroll={event => this.currentScrollOffset = event.nativeEvent.contentOffset.y}
                  scrollEventThrottle={10}>
          <LargeHeadline style={{marginTop: 10}}>Messages</LargeHeadline>
          {this.renderConversations()}
      </ScrollView>
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
