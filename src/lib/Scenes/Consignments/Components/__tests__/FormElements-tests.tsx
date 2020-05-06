import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { Row } from "../FormElements"

import { Theme } from "@artsy/palette"

describe("Row", () => {
  it("row passes style props, and other props into the view", () => {
    const tree = renderer
      .create(
        <Theme>
          <Row
            renderToHardwareTextureAndroid={true}
            style={{
              scaleX: 23,
            }}
          />
        </Theme>
      )
      .toJSON()
    // @ts-ignore STRICTNESS_MIGRATION
    expect(tree.props.renderToHardwareTextureAndroid).toBeTruthy()

    // @ts-ignore STRICTNESS_MIGRATION
    const styles = Object.keys(tree.props.style[0])
    expect(styles).toContain("scaleX")
  })
})
