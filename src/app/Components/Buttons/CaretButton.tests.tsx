import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"

import { CaretButton } from "./CaretButton"

import { extractText } from "app/utils/tests/extractText"
import { TouchableOpacity } from "react-native"

describe("CaretButton", () => {
  it("renders properly", () => {
    const tree = renderWithWrappersLEGACY(<CaretButton text="I am a caret button" />)
    expect(tree.root.findAllByType(TouchableOpacity)).toBeTruthy()
    expect(extractText(tree.root)).toContain("I am a caret button")
  })
})
