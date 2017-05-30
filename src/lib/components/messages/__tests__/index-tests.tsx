import * as React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import Inbox from "../inbox/inbox"

it("Sets up the right view hierarchy", () => {
    const tree = renderer.create(<Inbox />).toJSON()
    expect(tree).toMatchSnapshot()
})
