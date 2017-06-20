import * as React from "react"
import * as Relay from "react-relay"

import { ScrollView } from "react-native"
import ActiveBids from "../Components/Inbox/Bids"
import Conversations from "../Components/Inbox/Conversations"
import ZeroStateInbox from "../Components/Inbox/Conversations/ZerostateInbox"

export class Inbox extends React.Component<any, any> {
  currentScrollOffset?: number = 0

  hasNoContent() {
    const userHasConversations = this.props.me.conversations.edges.length > 0
    return !userHasConversations
  }

  render() {
    return this.hasNoContent()
      ? <ZeroStateInbox />
      : <ScrollView
          onScroll={event => (this.currentScrollOffset = event.nativeEvent.contentOffset.y)}
          scrollEventThrottle={10}
        >
          <ActiveBids me={this.props.me} />
          <Conversations me={this.props.me} />
        </ScrollView>
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
