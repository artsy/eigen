import React from "react"
import * as renderer from "react-test-renderer"

import { CaretButton } from "../CaretButton"

describe("CaretButton", () => {
  it("renders properly", () => {
    const button = renderer.create(<CaretButton text="I am a caret button" />)
    expect(button).toMatchSnapshot()
  })
})
