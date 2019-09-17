import moment from "moment"
import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import ConversationSnippet from "../ConversationSnippet"

import { Theme } from "@artsy/palette"

it("renders correctly with an artwork", () => {
  const tree = renderer.create(
    <Theme>
      <ConversationSnippet conversation={artworkConversation as any} onSelected={null} />
    </Theme>
  )
  expect(tree).toMatchSnapshot()
})

it("renders correctly with a show", () => {
  const tree = renderer.create(
    <Theme>
      <ConversationSnippet conversation={showConversation as any} onSelected={null} />
    </Theme>
  )
  expect(tree).toMatchSnapshot()
})

const artwork = {
  __typename: "Artwork" as "Artwork",
  title: "Karl and Anna Face Off (Diptych)",
  date: "2016",
  artistNames: "Bradley Theodore",
  image: {
    url: "https://d32dm0rphc51dk.cloudfront.net/bJ9I_vJX9ksaKFJAkOAIKg/normalized.jpg",
  },
}

const show = {
  __typename: "Show" as "Show",
  fair: {
    name: "Catty Fair",
  },
  name: "Catty Show",
  coverImage: {
    url: "https://d32dm0rphc51dk.cloudfront.net/bJ9I_vJX9ksaKFJAkOAIKg/normalized.jpg",
  },
}

const artworkConversation = {
  __typename: "Conversation",
  id: "582",
  inquiry_id: "59302144275b244a81d0f9c6",
  from: { name: "Jean-Luc Collecteur", email: "luc+messaging@artsymail.com" },
  to: { name: "ACA Galleries" },
  last_message: "Karl and Anna... Fab!",
  last_message_at: moment()
    .subtract(1, "year")
    .toISOString(),
  unread: true,
  created_at: "2017-06-01T14:14:35.538Z",
  items: [
    {
      item: artwork,
    },
  ],
}

const showConversation = {
  __typename: "Conversation",
  id: "582",
  inquiry_id: "59302144275b244a81d0f9c6",
  from: { name: "Jean-Luc Collecteur", email: "luc+messaging@artsymail.com" },
  to: { name: "ACA Galleries" },
  last_message: "Karl and Anna... Fab!",
  last_message_at: moment()
    .subtract(1, "year")
    .toISOString(),
  unread: true,
  created_at: "2017-06-01T14:14:35.538Z",
  items: [
    {
      item: show,
    },
  ],
}
