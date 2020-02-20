import { storiesOf } from "@storybook/react-native"
import React from "react"
import "react-native"
import { ScrollView } from "react-native"

import { ConversationSnippet_conversation } from "__generated__/ConversationSnippet_conversation.graphql"
import { ConversationSnippet } from "../ConversationSnippet"

const conversation = ({
  id: "582",
  to: { name: "ACA Galleries" },
  lastMessage: "Karl and Anna... Fab!",
  lastMessageAt: null, // moment().subtract(1, "year").toISOString(),
  unread: true,
  items: [
    {
      item: {
        __typename: "Artwork" as "Artwork",
        title: "Karl and Anna Face Off (Diptych)",
        date: "2016",
        artistNames: "Bradley Theodore",
        image: {
          url: "https://d32dm0rphc51dk.cloudfront.net/bJ9I_vJX9ksaKFJAkOAIKg/normalized.jpg",
        },
      },
    },
  ],
} as any) as ConversationSnippet_conversation

storiesOf("Conversations/Snippet")
  .add("Single row", () => <ConversationSnippet conversation={conversation} />)
  .add("A few threads", () => (
    <ScrollView>
      <ConversationSnippet conversation={conversation} />
      <ConversationSnippet conversation={conversation} />
      <ConversationSnippet conversation={conversation} />
    </ScrollView>
  ))
