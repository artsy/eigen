import ConnectivityBanner from "lib/Components/ConnectivityBanner"
import Composer from "lib/Components/Inbox/Conversations/Composer"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"
import { Conversation, ConversationFragmentContainer } from "../Conversation"

jest.unmock("react-tracking")

jest.mock("@react-native-community/netinfo", () => {
  return {
    addEventListener: jest.fn(),
    isConnected: {
      fetch: () => {
        return new Promise(accept => {
          accept(false)
        })
      },
      addEventListener: jest.fn(),
    },
  }
})

it("looks correct when rendered", () => {
  const conversation = renderWithWrappers(<ConversationFragmentContainer me={props as any} />)
  // @ts-ignore
  conversation.root.findByType(Conversation).children[0].instance.handleConnectivityChange(true)
  expect(conversation.root.findByType(Composer).props.disabled).toBeFalsy()
  expect(conversation.root.findAllByType(ConnectivityBanner)).toHaveLength(0)
})

it("displays a connectivity banner when network is down", () => {
  const conversation = renderWithWrappers(<ConversationFragmentContainer me={props as any} />)
  // @ts-ignore
  conversation.root.findByType(Conversation).children[0].instance.handleConnectivityChange(false)
  expect(conversation.root.findByType(Composer).props.disabled).toBeTruthy()
  expect(conversation.root.findAllByType(ConnectivityBanner)).toHaveLength(1)
})

const props = {
  initials: "JC",
  conversation: {
    gravityID: "conversation-420",
    id: "420",
    from: {
      name: "Anita Garibaldi",
      email: "anita@garibaldi.br",
      initials: "AG",
    },
    to: { name: "Kimberly Klark", initials: "KK" },
    unread: false,
    initial_message: "Adoro! Por favor envie-me mais informações",
    last_message_id: "222",
    messages: {
      edges: [
        {
          node: {
            gravityID: "unique-id",
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
  },
}
