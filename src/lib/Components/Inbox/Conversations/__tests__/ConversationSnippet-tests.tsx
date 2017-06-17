import * as moment from "moment"
import * as React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import ConversationSnippet from "../ConversationSnippet"

it("renders correctly", () => {
  const tree = renderer.create(<ConversationSnippet conversation={conversation} onSelected={null} />)
  expect(tree).toMatchSnapshot()
})

const conversation = {
  id: "582",
  inquiry_id: "59302144275b244a81d0f9c6",
  from_name: "Jean-Luc Collecteur",
  from_email: "luc+messaging@artsymail.com",
  to_name: "ACA Galleries",
  last_message: "Karl and Anna... Fab!",
  last_message_at: moment().subtract(30, "minutes").toISOString(),
  created_at: "2017-06-01T14:14:35.538Z",
  artworks: [
    {
      id: "bradley-theodore-karl-and-anna-face-off-diptych",
      href: "/artwork/bradley-theodore-karl-and-anna-face-off-diptych",
      title: "Karl and Anna Face Off (Diptych)",
      date: "2016",
      artist_names: "Bradley Theodore",
      image: {
        url: "https://d32dm0rphc51dk.cloudfront.net/bJ9I_vJX9ksaKFJAkOAIKg/normalized.jpg",
        image_url: "https://d32dm0rphc51dk.cloudfront.net/bJ9I_vJX9ksaKFJAkOAIKg/:version.jpg",
      },
    },
  ],
}
