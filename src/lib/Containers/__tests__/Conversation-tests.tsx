import * as moment from "moment"
import * as React from "react"

import "react-native"
import * as renderer from "react-test-renderer"
import Conversation from "../Conversation"

jest.mock("NetInfo", () => {
  return {
    addEventListener: jest.fn(),
    isConnected: {
      fetch: () => {
        return new Promise((accept, resolve) => {
          accept(false)
        })
      },
      addEventListener: jest.fn(),
    },
  }
})

it("looks correct when rendered", () => {
  const conversation = renderer.create(<Conversation me={props} />) as any
  const instance = conversation.getInstance()

  // Assumes decent connectivity
  instance.handleConnectivityChange(true)

  expect(conversation).toMatchSnapshot()
})

it("displays a connectivity banner when network is down", () => {
  const conversation = renderer.create(<Conversation me={props} />) as any
  const instance = conversation.getInstance()

  // Network goes down
  instance.handleConnectivityChange(false)

  expect(conversation).toMatchSnapshot()
})

it("looks correct when rendered", () => {
  const conversation = renderer.create(<Conversation me={props} />) as any
  const instance = conversation.getInstance()

  // Assumes decent connectivity
  instance.handleConnectivityChange(true)

  expect(conversation).toMatchSnapshot()
})

it("sends message when composer is submitted", async () => {
  function sendMessage() {
    return new Promise((resolve, reject) => {
      const onMessageSent = text => {
        expect(text).toEqual("Hello world")
        resolve(true)
      }

      setTimeout(reject, 1000)

      const conversation = renderer.create(
        <Conversation
          me={props}
          onMessageSent={onMessageSent}
          relay={{
            environment: {},
          }}
        />
      ) as any

      const instance = conversation.getInstance()
      instance.composer.setState({ text: "Hello world" })
      instance.composer.submitText()
    })
  }

  return sendMessage().then(successful => {
    expect(successful).toBeTruthy()
  })
})

const props = {
  initials: "JC",
  conversation: {
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
  },
}
