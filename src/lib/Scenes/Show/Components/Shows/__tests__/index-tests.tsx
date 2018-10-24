import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import { Shows } from "../index"

it("looks correct when rendererd", () => {
  const comp = renderer.create(<Shows shows={[]} />)
  expect(comp).toMatchSnapshot()
})
