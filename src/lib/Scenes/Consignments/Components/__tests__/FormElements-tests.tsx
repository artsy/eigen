import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"

import { Row } from "../FormElements"

describe("Row", () => {
  it("row passes style props, and other props into the view", () => {
    const tree = renderWithWrappers(
      <Row
        renderToHardwareTextureAndroid={true}
        style={{
          scaleX: 23,
        }}
      />
    ).toJSON()
    // @ts-ignore STRICTNESS_MIGRATION
    expect(tree.props.renderToHardwareTextureAndroid).toBeTruthy()

    // @ts-ignore STRICTNESS_MIGRATION
    const styles = Object.keys(tree.props.style[0])
    expect(styles).toContain("scaleX")
  })
})
