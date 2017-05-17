import * as React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import Welcome from "../welcome"

it("Sets up the right view heirarchy", () => {
    const tree = renderer.create(<Welcome />).toJSON()
    expect(tree).toMatchSnapshot()
})
