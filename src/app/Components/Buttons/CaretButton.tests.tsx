import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"

import { CaretButton } from "./CaretButton"

import { extractText } from "app/tests/extractText"
import { TouchableOpacity } from "react-native"

describe("CaretButton", () => {
  it("renders properly", () => {
    const tree = renderWithWrappers(<CaretButton text="I am a caret button" />)
    expect(tree.root.findAllByType(TouchableOpacity)).toBeTruthy()
    expect(extractText(tree.root)).toContain("I am a caret button")
  })
})
