import React from "react"
import * as renderer from "react-test-renderer"

import MyProfile from "../MyProfile"

jest.mock("../LoggedInUserInfo")

it("looks like expected", () => {
  const tree = renderer.create(<MyProfile />).toJSON()
  expect(tree).toMatchSnapshot()
})
