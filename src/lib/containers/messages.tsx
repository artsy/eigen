import * as React from "react"
import * as Relay from "react-relay"

import {
  Text,
} from "react-native"

export class Messages extends React.Component<{}, {}> {
  render() {
    return (
        <Text>Hello world</Text>
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
