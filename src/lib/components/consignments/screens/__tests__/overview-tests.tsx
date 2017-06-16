import * as React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import Overview from "../overview"

it("Sets up the right view hierarchy", () => {
  const nav = {} as any
  const route = {} as any
  const tree = renderer.create(<Overview navigator={nav} route={route} setup={{}} />).toJSON()
  expect(tree).toMatchSnapshot()
})
