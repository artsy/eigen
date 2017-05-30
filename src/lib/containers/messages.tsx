import * as React from "react"
import * as Relay from "react-relay"

import Inbox from "../../lib/components/messages/inbox/inbox"

export class Messages extends React.Component<{}, {}> {
  render() {
    return (
      <Inbox />
    )
  }
}

export default Relay.createContainer(Messages, {
  fragments: {
    me: () => Relay.QL`
      fragment on Me {
        name
      }
    `,
  },
})
