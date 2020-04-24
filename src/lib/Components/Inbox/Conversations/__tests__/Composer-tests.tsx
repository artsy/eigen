// @ts-ignore STRICTNESS_MIGRATION
import { shallow } from "enzyme"
import React from "react"
import "react-native"
import { TouchableWithoutFeedback } from "react-native"
import * as renderer from "react-test-renderer"

jest.unmock("react-tracking")

import Composer, { SendButton } from "../Composer"

import { Theme } from "@artsy/palette"

it("renders without throwing a error", () => {
  renderer.create(
    <Theme>
      <Composer />
    </Theme>
  )
})

describe("regarding the send button", () => {
  it("disables it even if it contains text if the disabled prop is true", () => {
    const overrideText = "History repeats itself, first as tragedy, second as farce."
    // We're using 'dive' here to only fetch the component we want to test
    // This is because the component is wrapped by react-tracking, which changes the tree structure
    const tree = renderer.create(<Composer value={overrideText} disabled={true} />)

    expect(tree.root.findByType(SendButton).props.disabled).toBeTruthy()
  })

  it("calls onSubmit with the text when send button is pressed", () => {
    const onSubmit = jest.fn()
    // We're using 'dive' here to only fetch the component we want to test
    // This is because the component is wrapped by react-tracking, which changes the tree structure
    const wrapper = shallow(<Composer onSubmit={onSubmit} />)
      .dive()
      .dive()
    const text = "Don't trust everything you see, even salt looks like sugar"
    wrapper.setState({ text })
    wrapper.find(TouchableWithoutFeedback).simulate("press")
    expect(onSubmit).toBeCalledWith(text)
  })
})
