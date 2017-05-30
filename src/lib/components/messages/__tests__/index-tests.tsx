import * as React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import Inbox from "../inbox/inbox"

it("Looks correct when rendered", () => {
    const tree = renderer.create(<Inbox />).toJSON()
    expect(tree).toMatchSnapshot()
})
