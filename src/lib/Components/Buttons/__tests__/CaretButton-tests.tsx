import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"

import { CaretButton } from "../CaretButton"

import { extractText } from "lib/tests/extractText"

describe("CaretButton", () => {
  it("renders properly", () => {
    const button = renderWithWrappers(<CaretButton text="I am a caret button" />)
    expect(extractText(button.root)).toContain("I am a caret button")
  })
})
