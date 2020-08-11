import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"

import { CaretButton } from "../CaretButton"

import { Theme } from "@artsy/palette"
import { extractText } from "lib/tests/extractText"

describe("CaretButton", () => {
  it("renders properly", () => {
    const button = renderWithWrappers(
      <Theme>
        <CaretButton text="I am a caret button" />
      </Theme>
    )
    expect(extractText(button.root)).toContain("I am a caret button")
  })
})
