import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { Avatar } from "../Avatar"

import { Theme } from "@artsy/palette"

it("renders without throwing a error", () => {
  renderer.create(
    <Theme>
      <Avatar isUser={true} initials={"MC"} />
    </Theme>
  )
})
