import React from "react"
import * as renderer from "react-test-renderer"

import { MyProfile } from "../MyProfile"

jest.mock("../LoggedInUserInfo")

it("renders without throwing an error", () => {
  renderer.create(<MyProfile />)
})
