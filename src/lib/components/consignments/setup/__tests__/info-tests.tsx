import * as React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import Info from "../info"

it("Sets up the right view heirarchy", () => {
  const nav = {} as any
  const route = {} as any
  const tree = renderer.create(<Info navigator={nav} route={route} />).toJSON()
  expect(tree).toMatchSnapshot()
})
