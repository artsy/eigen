import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"

import { Row } from "../FormElements"

describe(Row, () => {
  it("row passes style props, and other props into the view", () => {
    const tree = renderWithWrappers(
      <Row
        renderToHardwareTextureAndroid={true}
        style={{
          scaleX: 23,
        }}
      />
    )
    expect(tree.root.findByType(Row).props.renderToHardwareTextureAndroid).toBeTruthy()

    const styles = tree.root.findByType(Row).props.style
    expect(styles).toContainKey("scaleX")
  })
})
