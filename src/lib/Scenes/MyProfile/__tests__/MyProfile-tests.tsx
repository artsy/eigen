import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"

import { MyProfileQueryRenderer } from "../MyProfile"

jest.mock("../LoggedInUserInfo")
jest.unmock("react-relay")

it("renders without throwing an error", () => {
  renderWithWrappers(<MyProfileQueryRenderer />)
})
