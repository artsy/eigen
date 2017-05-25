import * as React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import Welcome from "../welcome"

it("Sets up the right view hierarchy", () => {
      const nav = {} as any
      const route = {} as any

      const tree = renderer.create(<Welcome navigator={nav} route={route}/>).toJSON()
      expect(tree).toMatchSnapshot()
})
