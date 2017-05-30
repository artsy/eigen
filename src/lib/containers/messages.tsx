import * as React from "react"
import * as Relay from "react-relay"

import Inbox from "../../lib/components/messages/inbox/inbox"

export class Messages extends React.Component<any, any> {
  render() {
    return (
      <Inbox conversations={this.props.me.conversations} />
    )
  }
}

export default Relay.createContainer(Messages, {
  fragments: {
    me: () => Relay.QL`
      fragment on Me {
        name
        conversations {
          ${Inbox.getFragment("conversations")}
        }
      }
    `,
  },
})
