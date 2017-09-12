import * as React from "react"
import { createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"
import styled from "styled-components/native"

import { RefreshControl, ScrollView, View } from "react-native"
import ActiveBids from "../Components/Inbox/ActiveBids"
import Conversations from "../Components/Inbox/Conversations"
import ZeroStateInbox from "../Components/Inbox/Conversations/ZeroStateInbox"

interface Props extends RelayProps {
  relay?: RelayRefetchProp
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
    this.props.relay.refetch(
      {},
      null,
      () => {
        this.setState({ fetchingData: false })
      },
      { force: true }
    )
  }

  render() {
    const hasBids = this.props.me.lot_standings.length > 0
    const hasConversations = this.props.me.conversations_existence_check.edges.length > 0
    return hasBids || hasConversations
      ? <Container refreshControl={<RefreshControl refreshing={this.state.fetchingData} onRefresh={this.fetchData} />}>
          <ActiveBids me={this.props.me as any} />
          <Conversations me={this.props.me} />
        </Container>
      : <ZeroStateInbox />
  }
}

// FIXME: The `lot_standings` snippet is copy-pasted from the `ActiveBids` component so it doesn’t fetch data that’s not
//        really needed MP should really just expose something like `has_active_bids` and ensure that it doesn’t perform
//        extra backend reuqests to determine if it has active bids and resolve the `ActiveBids` query.
//
//        The same applies to the `conversations` snippet.
//
// TODO:  After switch to modern, we can use the following stopgap instead:
//
//        ...Conversations_me @relay(mask: false)
//        ...ActiveBids_me @relay(mask: false)
//
export default createRefetchContainer(
  Inbox,
  {
    me: graphql`
      fragment Inbox_me on Me {
        lot_standings(active_positions: true) {
          active_bid {
            __id
          }
        }
        conversations_existence_check: conversations(first: 1) {
          edges {
            node {
              id
            }
          }
        }
        ...Conversations_me
        ...ActiveBids_me
      }
    `,
  },
  graphql`
    query InboxRefetchQuery {
      me {
        ...Inbox_me
      }
    }
  `
)

interface RelayProps {
  me: {
    lot_standings: Array<{
      active_bid: {
        __id: string
      } | null
    } | null> | null
    conversations_existence_check: {
      edges: Array<{
        node: {
          id: string | null
        } | null
      } | null> | null
    } | null
  }
}
