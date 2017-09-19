import * as React from "react"

import "react-native"
import * as renderer from "react-test-renderer"
import Messages from "../Messages"

it("looks correct when rendered", () => {
  const messages = renderer.create(<Messages conversation={props} />) as any
  expect(messages).toMatchSnapshot()
})

const props = {
  id: "420",
  from: {
    name: "Anita Garibaldi",
    email: "anita@garibaldi.br",
    initials: "AG",
  },
  to: { name: "Kimberly Klark", initials: "KK" },
  initial_message: "Adoro! Por favor envie-me mais informações",
  messages: {
    edges: [
      {
        node: {
          id: 222,
          body: "Adoro! Por favor envie-me mais informações",
          from_email_address: "anita@garibaldi.br",
          attachments: [],
          from: {
            name: "Percy",
            email: "percy@cat.com",
          },
        },
      },
    ],
  },
  items: [
    {
      title: "The Mythic Being: Sol’s Drawing #1–5",
      item: {
        __typename: "Artwork",
        id: "adrian-piper-the-mythic-being-sols-drawing-number-1-5",
        href: "/artwork/adrian-piper-the-mythic-being-sols-drawing-number-1-5",
        title: "The Mythic Being: Sol’s Drawing #1–5",
        date: "1974",
        artist_names: "Adrian Piper",
        image: {
          url: "https://d32dm0rphc51dk.cloudfront.net/W1FkNoM9IjrND_xv_DTkeg/normalized.jpg",
          image_url: "https://d32dm0rphc51dk.cloudfront.net/J0uofgV9e8cIxGiZwn12mg/:version.jpg",
        },
      },
    },
  ],
}
