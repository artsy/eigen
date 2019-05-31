import moment from "moment"
import React from "react"
import "react-native"
import { NativeModules } from "react-native"
import * as renderer from "react-test-renderer"

import Message from "../Message"

import { Theme } from "@artsy/palette"

beforeAll(() => {
  NativeModules.ARNotificationsManager = { addListener: jest.fn(), remove: jest.fn() }
})

it("looks correct when rendered", () => {
  // tslint:disable-next-line:max-line-length
  const messageBody =
    "Hi, I'm interested in purchasing this work. Could you please provide more information about the piece, including price?"
  const senderName = "Sarah"
  const props = {
    key: 0,
    created_at: moment()
      .subtract(1, "year")
      .toISOString(),
    body: messageBody,
    is_from_user: true,
    attachments: [],
    from: {
      name: "Percy",
      email: "percy@cat.com",
    },
    invoice: {
      state: "UNPAID",
      total: "$420",
      payment_url: "https://www.adopt-cats.org/pay-here",
    },
  }
  const tree = renderer
    .create(
      <Theme>
        <Message
          conversationId={"420"}
          initialText=""
          firstMessage={false}
          index={0}
          senderName={senderName}
          message={props as any}
        />
      </Theme>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
