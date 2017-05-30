import * as React from "react"

import {
  LargeHeadline,
} from "../typography"

import {
  ScrollView,
} from "react-native"

import ConversationSnippet from "./conversationsnippet"

export default class Inbox extends React.Component<{}, any> {

  render() {
    return  (
      <ScrollView>
          <LargeHeadline style={{marginTop: 10}}>Messages</LargeHeadline>
          <ConversationSnippet />
          <ConversationSnippet />
          <ConversationSnippet />
          <ConversationSnippet />
          <ConversationSnippet />
      </ScrollView>
    )
  }
}
