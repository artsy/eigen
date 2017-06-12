import * as React from "react"
import * as Relay from "react-relay"

import { ScrollView } from "react-native"
import ActiveBids from "../Components/Inbox/Bids"
import Conversations from "../Components/Inbox/Conversations"

export class Inbox extends React.Component<any, any> {
  currentScrollOffset?: number = 0

  render() {
    // TODO: add live auction stuff before conversations
    return (
      <ScrollView
        onScroll={event => (this.currentScrollOffset = event.nativeEvent.contentOffset.y)}
        scrollEventThrottle={10}
      >
        <ActiveBids me={this.props.me} />
        <Conversations me={this.props.me} />
      </ScrollView>
    )
  }
}

export default Relay.createContainer(Inbox, {
  fragments: {
    me: () => Relay.QL`
      fragment on Me {
        ${Conversations.getFragment("me")}
        ${ActiveBids.getFragment("me")}
      }
    `,
  },
})
