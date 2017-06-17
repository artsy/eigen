import * as React from "react"
import * as Relay from "react-relay"

import Conversations from "../Components/Inbox/Conversations"

export class Inbox extends React.Component<any, any> {
  render() {
    // TODO: add live auction stuff before conversations
    return <Conversations me={this.props.me} />
  }
}

export default Relay.createContainer(Inbox, {
  fragments: {
    me: () => Relay.QL`
      fragment on Me {
        ${Conversations.getFragment("me")}
      }
    `,
  },
})
