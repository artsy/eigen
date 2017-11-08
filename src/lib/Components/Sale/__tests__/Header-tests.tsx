import { NativeModules } from "react-native"

import * as React from "react"
import * as renderer from "react-test-renderer"

import Header from "../Header"

it("renders properly", () => {
  const sale = {
    name: "The Awesome Sale",
  }
  const header = renderer.create(<Header sale={sale} />).toJSON()
  expect(header).toMatchSnapshot()
})
