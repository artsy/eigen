import { storiesOf } from "@storybook/react-native"
import React from "react"
import "react-native"
import { Message } from "../Message"

const messageWithoutFromNameProps = {
  senderName: "Matt",
  firstMessage: false,
  index: 2,
  initialText: "This is initial tet",
  conversationId: "1",
  message: {
    body: "body of the message",
    created_at: null,
    is_from_user: false,
    invoice: null,
    from: {
      name: null,
      email: "matt@testing.com",
    },
    attachments: [],
  },
}

const messageWithFromNameProps = {
  senderName: "Matt",
  firstMessage: false,
  index: 2,
  initialText: "This is initial tet",
  conversationId: "1",
  message: {
    body: "body of the message",
    created_at: null,
    is_from_user: false,
    invoice: null,
    from: {
      name: "Matt the tester",
      email: "matt@testing.com",
    },
    attachments: [],
  },
}
storiesOf("Conversations/Message")
  .add("without fromName and not from user", () => {
    return <Message {...messageWithoutFromNameProps as any} />
  })
  .add("With fromName and not from user", () => {
    return <Message {...messageWithFromNameProps as any} />
  })
