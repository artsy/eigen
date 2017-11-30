import React from "react"
import { createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"
import styled from "styled-components/native"

import ActiveBids from "lib/Components/Inbox/ActiveBids"
import Conversations from "lib/Components/Inbox/Conversations"
import ZeroStateInbox from "lib/Components/Inbox/Conversations/ZeroStateInbox"
import { RefreshControl, ScrollView, View } from "react-native"

interface Props extends RelayProps {
  relay?: RelayRefetchProp
}

interface State {
  fetchingData: boolean
}

const Container = styled.ScrollView`flex: 1;`

export class Inbox extends React.Component<Props, State> {
  conversations: any

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
    this.conversations._refetchConnection(10, () => {
      this.setState({ fetchingData: false })
    })
  }

  render() {
    const hasBids = this.props.me.lot_standings.length > 0
    const hasConversations =
      this.props.me.conversations_existence_check && this.props.me.conversations_existence_check.edges.length > 0
    return hasBids || hasConversations
      ? <Container refreshControl={<RefreshControl refreshing={this.state.fetchingData} onRefresh={this.fetchData} />}>
          <ActiveBids me={this.props.me as any} />
          <Conversations me={this.props.me} ref={conversations => (this.conversations = conversations)} />
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
        lot_standings(live: true) {
          most_recent_bid {
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
