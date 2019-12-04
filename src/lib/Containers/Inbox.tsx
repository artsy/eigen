import { Flex, Theme } from "@artsy/palette"
import { Inbox_me } from "__generated__/Inbox_me.graphql"
import ActiveBids, { ActiveBids as ActiveBidsRef } from "lib/Components/Inbox/ActiveBids"
import Conversations, { Conversations as ConversationsRef } from "lib/Components/Inbox/Conversations"
import ZeroStateInbox from "lib/Components/Inbox/Conversations/ZeroStateInbox"
import { get } from "lib/utils/get"
import { ProvideScreenDimensions } from "lib/utils/useScreenDimensions"
import React from "react"
import { RefreshControl } from "react-native"
import { createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"
import styled from "styled-components/native"

interface Props {
  me: Inbox_me
  relay: RelayRefetchProp
  isVisible: boolean
}

interface State {
  fetchingData: boolean
}

const Container = styled.ScrollView`
  flex: 1;
`

export class Inbox extends React.Component<Props, State> {
  conversations: ConversationsRef
  activeBids: ActiveBidsRef

  state = {
    fetchingData: false,
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.isVisible) {
      this.fetchData()
    }
  }

  fetchData = () => {
    if (this.state.fetchingData) {
      return
    }

    this.setState({ fetchingData: true })

    if (this.activeBids && this.conversations) {
      // Allow Conversations & Active Bids to properly force-fetch themselves.
      this.activeBids.refreshActiveBids()
      this.conversations.refreshConversations(() => {
        this.setState({ fetchingData: false })
      })
    } else {
      this.props.relay.refetch({}, null, () => {
        this.setState({ fetchingData: false })
      })
    }
  }

  render() {
    const lotStanding = get(this.props, p => p.me.lot_standings)
    const conversationsExistenceCheck = get(this.props, p => p.me.conversations_existence_check.edges)
    const hasBids = !!lotStanding && lotStanding.length > 0
    const hasConversations = !!conversationsExistenceCheck && conversationsExistenceCheck.length > 0
    return hasBids || hasConversations ? (
      <Theme>
        <Container refreshControl={<RefreshControl refreshing={this.state.fetchingData} onRefresh={this.fetchData} />}>
          <ActiveBids me={this.props.me as any} componentRef={activeBids => (this.activeBids = activeBids)} />
          <Conversations
            me={this.props.me as any}
            componentRef={conversations => (this.conversations = conversations)}
          />
        </Container>
      </Theme>
    ) : (
      <Theme>
        <ProvideScreenDimensions>
          <Flex style={{ flex: 1 }}>
            <ZeroStateInbox />
          </Flex>
        </ProvideScreenDimensions>
      </Theme>
    )
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
        lot_standings: lotStandings(live: true) {
          most_recent_bid: mostRecentBid {
            id
          }
        }
        conversations_existence_check: conversationsConnection(first: 1) {
          edges {
            node {
              internalID
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
