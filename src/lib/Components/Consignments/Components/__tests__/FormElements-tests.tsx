import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { Form, Label, Row } from "../FormElements"

describe("Row", () => {
  it("row passes style props, and other props into the view", () => {
    const tree = renderer.create(<Row renderToHardwareTextureAndroid={true} style={{ scaleX: 23 }} />).toJSON()
    expect(tree.props.renderToHardwareTextureAndroid).toBeTruthy()

    const styles = Object.keys(tree.props.style[0])
    expect(styles).toContain("scaleX")
  })
})
