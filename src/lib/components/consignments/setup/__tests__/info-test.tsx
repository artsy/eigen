import * as React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import Info from "../info"

it("Sets up the right view heirarchy", () => {
    const tree = renderer.create(<Info />).toJSON()
    expect(tree).toMatchSnapshot()
})
