import * as React from "react"
import * as Relay from "react-relay/classic"
import styled from "styled-components/native"

import { RefreshControl, ScrollView, View } from "react-native"
import ActiveBids from "../Components/Inbox/Bids"
import Conversations from "../Components/Inbox/Conversations"
import ZeroStateInbox from "../Components/Inbox/Conversations/ZeroStateInbox"

interface Props extends RelayProps {
  relay?: Relay.RelayProp
}

interface State {
  fetchingData: boolean
}

const Container = styled.ScrollView`flex: 1;`

export class Inbox extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      fetchingData: false,
    }

    this.fetchData = this.fetchData.bind(this)
  }

  fetchData() {
    if (this.state.fetchingData) {
      return
    }

    this.setState({ fetchingData: true })
    this.props.relay.forceFetch({}, readyState => {
      if (readyState.done) {
        this.setState({ fetchingData: false })
      }
    })
  }

  render() {
    const hasBids = this.props.me.lot_standings.length > 0
    const hasConversations = this.props.me.conversations.edges.length > 0
    return hasBids || hasConversations
      ? <Container refreshControl={<RefreshControl refreshing={this.state.fetchingData} onRefresh={this.fetchData} />}>
          <ActiveBids me={this.props.me as any} />
          <Conversations me={this.props.me} />
        </Container>
      : <ZeroStateInbox />
  }
}

// FIXME The `lot_standings` snippet is copy-pasted from the `ActiveBids` component so it doesn’t fetch data that’s not
//       really needed, MP should really just expose something like `has_active_bids` and ensure that it doesn’t perform
//       extra backend reuqests to determine if it has active bids and resolve the `ActiveBids` query.
//
//       The same applies to the `conversations` snippet.
//
export default Relay.createContainer(Inbox, {
  fragments: {
    me: () => Relay.QL`
      fragment on Me {
        lot_standings(active_positions: true) {
          active_bid {
            __id
          }
        }
        conversations(first: 10) {
          edges {
            node {
              id
            }
          }
        }
        ${Conversations.getFragment("me")}
        ${ActiveBids.getFragment("me")}
      }
    `,
  },
})

interface RelayProps {
  me: {
    lot_standings: Array<{
      active_bid: {
        __id: string
      } | null
    } | null> | null
    conversations: {
      edges: Array<{
        node: {
          id: string | null
        } | null
      } | null> | null
    } | null
  }
}
