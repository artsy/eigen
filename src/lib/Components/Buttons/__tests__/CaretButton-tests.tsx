import React from "react"
import * as renderer from "react-test-renderer"

import { CaretButton } from "../CaretButton"

import { Theme } from "@artsy/palette"

describe("CaretButton", () => {
  it("renders properly", () => {
    const button = renderer.create(
      <Theme>
        <CaretButton text="I am a caret button" />
      </Theme>
    )
    expect(JSON.stringify(button.toJSON())).toContain("I am a caret button")
    expect(button).toMatchSnapshot()
  })
})
