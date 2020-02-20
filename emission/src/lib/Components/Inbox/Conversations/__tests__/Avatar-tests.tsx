import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import Avatar from "../Avatar"

import { Theme } from "@artsy/palette"

it("looks correct for a user with two initials", () => {
  const avatar = renderer
    .create(
      <Theme>
        <Avatar isUser={true} initials={"MC"} />
      </Theme>
    )
    .toJSON()
  expect(avatar).toMatchSnapshot()
})
