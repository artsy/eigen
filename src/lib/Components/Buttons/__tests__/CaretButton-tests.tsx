import React from "react"
import * as renderer from "react-test-renderer"

import { CaretButton } from "../CaretButton"

import { Theme } from "@artsy/palette"
import { extractText } from "lib/tests/extractText"

describe("CaretButton", () => {
  it("renders properly", () => {
    const button = renderer.create(
      <Theme>
        <CaretButton text="I am a caret button" />
      </Theme>
    )
    expect(extractText(button.root)).toContain("I am a caret button")
  })
})
