import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"

import Avatar from "../Avatar"

it("renders without throwing a error", () => {
  renderWithWrappers(<Avatar isUser={true} initials={"MC"} />)
})
