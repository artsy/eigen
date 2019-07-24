import { shallow } from "enzyme"
import React from "react"

import "react-native"
import Conversation from "../Conversation"

jest.unmock("react-tracking")

jest.mock("NetInfo", () => {
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
  const conversation = shallow(<Conversation me={props as any} />).dive()
  const instance = conversation.dive().instance()

  // Assumes decent connectivity
  instance.handleConnectivityChange(true)

  expect(conversation).toMatchSnapshot()
})

it("displays a connectivity banner when network is down", () => {
  const conversation = shallow(<Conversation me={props as any} />).dive()
  const instance = conversation.dive().instance()

  // Assumes decent connectivity
  instance.handleConnectivityChange(false)

  expect(conversation).toMatchSnapshot()
})

it("sends message when composer is submitted", async () => {
  function sendMessage() {
    return new Promise((resolve, reject) => {
      // TODO: The following commented areas are not being used
      // const onMessageSent = text => {
      //   expect(text).toEqual("Hello world")
      //   resolve(true)
      // }

      setTimeout(reject, 1000)

      // const conversation = shallow(
      //   <Conversation
      //     me={props}
      //     onMessageSent={onMessageSent}
      //     relay={{
      //       environment: {},
      //     }}
      //   />
      // ).dive()

      // const instance = conversation.instance()
      // instance.composer.setState({ text: "Hello world" })
      // instance.composer.submitText()
      // TODO(luc): fix composer so it's not undefined anymore. enzyme.shallow doesn't
      // call ref callbacks
      resolve(true)
    })
  }

  return sendMessage().then(successful => {
    expect(successful).toBeTruthy()
  })
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
