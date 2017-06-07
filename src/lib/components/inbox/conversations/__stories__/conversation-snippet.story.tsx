import { storiesOf } from "@storybook/react-native"
import * as React from "react"
import "react-native"
import {
  ScrollView,
} from "react-native"

import {Conversation, ConversationSnippet} from "../conversation_snippet"

const conversation: Conversation = {
    id: "582",
    inquiry_id: "59302144275b244a81d0f9c6",
    from_name: "Jean-Luc Collecteur",
    from_email: "luc+messaging@artsymail.com",
    to_name: "ACA Galleries",
    last_message: "Karl and Anna... Fab!",
    artworks: [
    {
        id: "bradley-theodore-karl-and-anna-face-off-diptych",
        href: "/artwork/bradley-theodore-karl-and-anna-face-off-diptych",
        title: "Karl and Anna Face Off (Diptych)",
        date: "2016",
        artist: {
        name: "Bradley Theodore",
        },
        image: {
        url: "https://d32dm0rphc51dk.cloudfront.net/bJ9I_vJX9ksaKFJAkOAIKg/normalized.jpg",
        image_url: "https://d32dm0rphc51dk.cloudfront.net/bJ9I_vJX9ksaKFJAkOAIKg/:version.jpg",
        },
    },
  ],
}

storiesOf("Conversations - Snippet")
  .add("Single row", () => <ConversationSnippet conversation={conversation} />)
  .add("A few threads", () => <ScrollView>
      <ConversationSnippet conversation={conversation} />
      <ConversationSnippet conversation={conversation} />
      <ConversationSnippet conversation={conversation} />
    </ScrollView>)
