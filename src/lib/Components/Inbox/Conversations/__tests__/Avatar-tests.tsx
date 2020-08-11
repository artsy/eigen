import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"

import Avatar from "../Avatar"

import { Theme } from "@artsy/palette"

it("renders without throwing a error", () => {
  renderWithWrappers(
    <Theme>
      <Avatar isUser={true} initials={"MC"} />
    </Theme>
  )
})
