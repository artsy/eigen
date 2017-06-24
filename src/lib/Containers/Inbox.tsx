import * as React from "react"
import * as Relay from "react-relay"
import styled from "styled-components/native"

import { ScrollView } from "react-native"
import ActiveBids from "../Components/Inbox/Bids"
import Conversations from "../Components/Inbox/Conversations"
import ZeroStateInbox from "../Components/Inbox/Conversations/ZerostateInbox"

export class Inbox extends React.Component<any, any> {
  hasNoContent() {
    const userHasConversations = this.props.me.conversations.edges.length > 0
    return !userHasConversations
  }

  render() {
    const headerView = <ActiveBids me={this.props.me} />
    return this.hasNoContent() ? <ZeroStateInbox /> : <Conversations me={this.props.me} headerView={headerView} />
  }
}

export default Relay.createContainer(Inbox, {
  fragments: {
    me: () => Relay.QL`
      fragment on Me {
        ${Conversations.getFragment("me")}
        ${ActiveBids.getFragment("me")}

        conversations(first: 10) {
          edges {
            node {
              id
            }
          }
        }

      }
    `,
  },
})
