import { renderWithWrappers } from "app/tests/renderWithWrappers"
import moment from "moment"
import React from "react"
import "react-native"

import Message from "./Message"

it("renders without throwing an error", () => {
  // tslint:disable-next-line:max-line-length
  const messageBody =
    "Hi, I'm interested in purchasing this work. Could you please provide more information about the piece, including price?"
  const props = {
    key: 0,
    createdAt: moment().subtract(1, "year").toISOString(),
    body: messageBody,
    isFromUser: true,
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
  renderWithWrappers(<Message conversationId="420" showTimeSince message={props as any} />)
})
