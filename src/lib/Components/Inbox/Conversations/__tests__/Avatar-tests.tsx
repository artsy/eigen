import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import Avatar from "../Avatar"

it("looks correct for a user with two initials", () => {
  const avatar = renderer.create(<Avatar isUser={true} initials={"MC"} />).toJSON()
  expect(avatar).toMatchSnapshot()
})
