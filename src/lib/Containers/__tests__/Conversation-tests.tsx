import * as moment from "moment"
import * as React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import Conversation from "../Conversation"

it("looks correct when rendered", () => {
  const tree = renderer.create(<Conversation me={props} />).toJSON()
  expect(tree).toMatchSnapshot()
})

const props = {
  initials: "JC",
  conversation: {
    id: "420",
    from: {
      name: "Anita Garibaldi",
      email: "anita@garibaldi.br",
    },
    to: { name: "Kimberly Klark" },
    initial_message: "Adoro! Por favor envie-me mais informações",
    messages: {
      edges: [
        {
          node: {
            id: 222,
            raw_text: "Adoro! Por favor envie-me mais informações",
            from_email_address: "anita@garibaldi.br",
            attachments: [],
          },
        },
      ],
    },
    artworks: [
      {
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
    ],
  },
}
