import * as React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import Message from "../message"

it("looks correct when rendered", () => {
  // tslint:disable-next-line:max-line-length
  const messageBody =
    "Hi, I'm interested in purchasing this work. Could you please provide more information about the piece, including price?"
  const props = { senderName: "Sarah Scott", key: 0, time: "11:00AM", body: messageBody }
  const tree = renderer.create(<Message message={props} />).toJSON()
  expect(tree).toMatchSnapshot()
})
