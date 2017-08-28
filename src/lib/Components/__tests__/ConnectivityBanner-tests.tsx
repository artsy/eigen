import * as React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import ConnectivityBanner from "../ConnectivityBanner"

it("looks like expected", () => {
  const tree = renderer.create(<ConnectivityBanner />).toJSON()
  expect(tree).toMatchSnapshot()
})
