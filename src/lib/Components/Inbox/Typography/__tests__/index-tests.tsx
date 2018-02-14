import { shallow } from "enzyme"
import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { Subtitle } from "../"

it("passes on props to subtitle", () => {
  const subtitle = shallow(
    <Subtitle numberOfLines={1} ellipsizeMode={"middle"}>
      My Subtitle
    </Subtitle>
  ).dive()
  console.log(subtitle.props())
  expect(subtitle.props().numberOfLines).toBe(1)
  expect(subtitle.props().ellipsizeMode).toBe("middle")
})
