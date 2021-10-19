import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"

import { Row } from "./FormElements"

describe("Row", () => {
  it("row passes style props, and other props into the view", () => {
    const tree = renderWithWrappers(
      <Row
        renderToHardwareTextureAndroid
        style={{
          scaleX: 23,
        }}
      />
    ).toJSON()
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    expect(tree.props.renderToHardwareTextureAndroid).toBeTruthy()

    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const styles = Object.keys(tree.props.style[0])
    expect(styles).toContain("scaleX")
  })
})
