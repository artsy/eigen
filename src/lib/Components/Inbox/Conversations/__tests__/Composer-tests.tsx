import { Button } from "@artsy/palette"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { TextInput } from "react-native"
import { TouchableWithoutFeedback } from "react-native"

jest.unmock("react-tracking")

import Composer from "../Composer"

it("renders without throwing a error", () => {
  renderWithWrappers(<Composer />)
})

describe("regarding the send button", () => {
  it("disables it even if it contains text if the disabled prop is true", () => {
    const overrideText = "History repeats itself, first as tragedy, second as farce."
    // We're using 'dive' here to only fetch the component we want to test
    // This is because the component is wrapped by react-tracking, which changes the tree structure
    const tree = renderWithWrappers(<Composer value={overrideText} disabled={true} />)

    expect(tree.root.findByType(Button).props.disabled).toBeTruthy()
  })

  it("calls onSubmit with the text when send button is pressed", () => {
    const onSubmit = jest.fn()
    // We're using 'dive' here to only fetch the component we want to test
    // This is because the component is wrapped by react-tracking, which changes the tree structure
    const tree = renderWithWrappers(<Composer onSubmit={onSubmit} />)
    const text = "Don't trust everything you see, even salt looks like sugar"
    tree.root.findByType(TextInput).props.onChangeText(text)
    tree.root.findByType(TouchableWithoutFeedback).props.onPress()
    expect(onSubmit).toBeCalledWith(text)
  })
})
