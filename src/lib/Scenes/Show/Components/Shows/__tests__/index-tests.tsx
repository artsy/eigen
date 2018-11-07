import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import { Shows } from "../index"

it("looks correct when rendered", () => {
  const comp = renderer.create(<Shows show={{ name: "this is a show" }} />)
  expect(comp).toMatchSnapshot()
})
