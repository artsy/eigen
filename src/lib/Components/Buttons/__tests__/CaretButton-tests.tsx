import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"

import { CaretButton } from "../CaretButton"

import { extractText } from "lib/tests/extractText"
import { Touchable } from "palette"
import { TouchableWithoutFeedback } from "react-native"

describe("CaretButton", () => {
  it("renders TouchableWithoutFeedback by default", () => {
    const tree = renderWithWrappers(<CaretButton text="I am a caret button" />)
    expect(tree.root.findAllByType(TouchableWithoutFeedback)).toBeTruthy()
    expect(extractText(tree.root)).toContain("I am a caret button")
  })

  it("renders Touchable when withFeedback is added", () => {
    const tree = renderWithWrappers(<CaretButton text="I am a caret button" withFeedback />)
    expect(tree.root.findAllByType(Touchable)).toBeTruthy()
    expect(extractText(tree.root)).toContain("I am a caret button")
  })
})
