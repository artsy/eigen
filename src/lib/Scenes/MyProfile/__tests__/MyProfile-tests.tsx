import React from "react"
import * as renderer from "react-test-renderer"

import { MyProfileQueryRenderer } from "../MyProfile"

jest.mock("../LoggedInUserInfo")
jest.unmock("react-relay")

it("renders without throwing an error", () => {
  renderer.create(<MyProfileQueryRenderer />)
})
