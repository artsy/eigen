import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import { Header } from "../index"

it("looks correct when rendererd", () => {
  const comp = renderer.create(<Header />)
  expect(comp).toMatchSnapshot()
})
