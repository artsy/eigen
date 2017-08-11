import * as moment from "moment"
import * as React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import ConversationSnippet from "../ConversationSnippet"

it("renders correctly with an artwork", () => {
  const tree = renderer.create(<ConversationSnippet conversation={artworkConversation} onSelected={null} />)
  expect(tree).toMatchSnapshot()
})

it("renders correctly with a show", () => {
  const tree = renderer.create(<ConversationSnippet conversation={showConversation} onSelected={null} />)
  expect(tree).toMatchSnapshot()
})

const artwork = {
  __typename: "Artwork",
  id: "bradley-theodore-karl-and-anna-face-off-diptych",
  href: "/artwork/bradley-theodore-karl-and-anna-face-off-diptych",
  title: "Karl and Anna Face Off (Diptych)",
  date: "2016",
  artist_names: "Bradley Theodore",
  image: {
    url: "https://d32dm0rphc51dk.cloudfront.net/bJ9I_vJX9ksaKFJAkOAIKg/normalized.jpg",
    image_url: "https://d32dm0rphc51dk.cloudfront.net/bJ9I_vJX9ksaKFJAkOAIKg/:version.jpg",
  },
}

const show = {
  __typename: "Show",
  fair: {
    name: "Catty Fair",
  },
  name: "Catty Show",
  cover_image: {
    url: "https://d32dm0rphc51dk.cloudfront.net/bJ9I_vJX9ksaKFJAkOAIKg/normalized.jpg",
  },
}

const artworkConversation = {
  id: "582",
  inquiry_id: "59302144275b244a81d0f9c6",
  from: { name: "Jean-Luc Collecteur", email: "luc+messaging@artsymail.com" },
  to: { name: "ACA Galleries" },
  last_message: "Karl and Anna... Fab!",
  last_message_at: moment().subtract(30, "minutes").toISOString(),
  is_last_message_to_user: true,
  last_message_open: null,
  created_at: "2017-06-01T14:14:35.538Z",
  items: [
    {
      item: artwork,
    },
  ],
}

const showConversation = {
  id: "582",
  inquiry_id: "59302144275b244a81d0f9c6",
  from: { name: "Jean-Luc Collecteur", email: "luc+messaging@artsymail.com" },
  to: { name: "ACA Galleries" },
  last_message: "Karl and Anna... Fab!",
  last_message_at: moment().subtract(30, "minutes").toISOString(),
  is_last_message_to_user: true,
  last_message_open: null,
  created_at: "2017-06-01T14:14:35.538Z",
  items: [
    {
      item: show,
    },
  ],
}
