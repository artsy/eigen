import * as React from "react"
import * as Relay from "react-relay"

import {
  LargeHeadline,
} from "../typography"

import {
  ScrollView,
} from "react-native"

import ConversationSnippet from "./conversationsnippet"

export class Inbox extends React.Component<any, any> {
  renderConversations() {
    return (this.props.conversations || []).map(conversation => (
      <ConversationSnippet conversation={conversation} />
    ))
  }

  render() {
    return (
      <ScrollView>
          <LargeHeadline style={{marginTop: 10}}>Messages</LargeHeadline>
          {this.renderConversations()}
      </ScrollView>
    )
  }
}

export default Relay.createContainer(Inbox, {
  fragments: {
    conversations: () => Relay.QL`
      fragment on ConversationType @relay(plural: true) {
        id
        inquiry_id
        from_name
        from_email
        to_name
        last_message
        artworks {
          id
          href
          title
          date
          artist {
            name
          }
          image {
            url
            image_url
          }
        }
      }
    `,
  },
})
