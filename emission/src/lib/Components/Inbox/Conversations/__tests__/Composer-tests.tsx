import { shallow } from "enzyme"
import React from "react"
import "react-native"
import { TouchableWithoutFeedback } from "react-native"
import * as renderer from "react-test-renderer"

jest.unmock("react-tracking")

import Composer from "../Composer"

import { Theme } from "@artsy/palette"

it("looks correct when rendered", () => {
  const tree = renderer
    .create(
      <Theme>
        <Composer />
      </Theme>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})

describe("regarding the send button", () => {
  it("disables it when there is no text", () => {
    const tree = renderer
      .create(
        <Theme>
          <Composer />
        </Theme>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it("disables it even if it contains text if the disabled prop is true", () => {
    const overrideText = "History repeats itself, first as tragedy, second as farce."
    // We're using 'dive' here to only fetch the component we want to test
    // This is because the component is wrapped by react-tracking, which changes the tree structure
    const tree = shallow(<Composer value={overrideText} disabled={true} />).dive()

    const instance = tree.dive().instance()
    instance.componentDidUpdate()

    expect(tree).toMatchSnapshot()
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
