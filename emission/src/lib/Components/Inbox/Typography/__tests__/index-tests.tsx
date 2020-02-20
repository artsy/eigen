import { shallow } from "enzyme"
import React from "react"
import "react-native"

import { Subtitle } from "../"

it("passes on props to subtitle", () => {
  const text = shallow(
    <Subtitle numberOfLines={1} ellipsizeMode={"middle"}>
      My Subtitle
    </Subtitle>
  ).dive()
  expect(text.props().numberOfLines).toBe(1)
  expect(text.props().ellipsizeMode).toBe("middle")
})
