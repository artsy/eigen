import { shallow } from "enzyme"
import React from "react"
import "react-native"
import { TouchableWithoutFeedback } from "react-native"
import * as renderer from "react-test-renderer"

import Composer from "../Composer"

it("looks correct when rendered", () => {
  const tree = renderer.create(<Composer />).toJSON()
  expect(tree).toMatchSnapshot()
})

describe("regarding the send button", () => {
  it("disables it when there is no text", () => {
    const tree = renderer.create(<Composer />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it("disables it even if it contains text if the disabled prop is true", () => {
    const overrideText = "History repeats itself, first as tragedy, second as farce."
    const tree = renderer.create(<Composer value={overrideText} disabled={true} />) as any

    const instance = tree.getInstance()
    instance.componentDidUpdate()

    expect(tree).toMatchSnapshot()
  })

  it("calls onSubmit with the text when send button is pressed", () => {
    const onSubmit = jest.fn()
    const wrapper = shallow(<Composer onSubmit={onSubmit} />)
    const text = "Don't trust everything you see, even salt looks like sugar"
    wrapper.setState({ text })
    wrapper.find(TouchableWithoutFeedback).simulate("press")
    expect(onSubmit).toBeCalledWith(text)
  })
})
