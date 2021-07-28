import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Serif } from "palette"
import React from "react"

import { TouchableWithoutFeedback } from "react-native"
import { theme } from "../../Elements/Theme"
import { CssTransition } from "../Animation/CssTransition"
import { Checkbox, CheckMark, DisabledMark } from "../Checkbox"

it("shows children within the checkbox", () => {
  const component = renderWithWrappers(
    <Checkbox>
      <Serif size="2">Remember me</Serif>
    </Checkbox>
  )

  expect(component.root.findAllByType(Serif).length).toEqual(1)
})

it("calls onPress when tapped", (done) => {
  let clicked: boolean
  const onPress = () => (clicked = true)

  const component = renderWithWrappers(<Checkbox onPress={onPress} />)

  component.root.findByType(TouchableWithoutFeedback).props.onPress()

  // The onPress() call above is an async call so the assertion call needs to be sent to the end of the event loop
  setTimeout(() => {
    expect(clicked).toEqual(true)
    done()
  }, 0)
})

it("shows a gray border and white background by default", () => {
  const component = renderWithWrappers(<Checkbox />)

  const checkboxStyle = component.root.findByType(CssTransition).props.style[1]

  expect(checkboxStyle.backgroundColor).toEqual(theme.colors.white100)
  expect(checkboxStyle.borderColor).toEqual(theme.colors.black10)
})

it("shows a black border and black background if checked is true", () => {
  const component = renderWithWrappers(<Checkbox error checked />)

  const checkboxStyle = component.root.findByType(CssTransition).props.style[1]

  expect(checkboxStyle.backgroundColor).toEqual(theme.colors.black100)
  expect(checkboxStyle.borderColor).toEqual(theme.colors.black100)
})

it("shows a purple border and white background if error is true", () => {
  const component = renderWithWrappers(<Checkbox error />)

  const checkboxStyle = component.root.findByType(CssTransition).props.style[1]

  expect(checkboxStyle.backgroundColor).toEqual(theme.colors.white100)
  expect(checkboxStyle.borderColor).toEqual(theme.colors.red100)
})

it("shows a black border and black background if both error and checked are true", () => {
  const component = renderWithWrappers(<Checkbox error checked />)

  const checkboxStyle = component.root.findByType(CssTransition).props.style[1]

  expect(checkboxStyle.backgroundColor).toEqual(theme.colors.black100)
  expect(checkboxStyle.borderColor).toEqual(theme.colors.black100)
})

it("shows a gray border and background if it is disabled", () => {
  const component = renderWithWrappers(<Checkbox disabled />)

  const checkboxStyle = component.root.findByType(CssTransition).props.style[1]

  expect(checkboxStyle.backgroundColor).toEqual(theme.colors.black5)
  expect(checkboxStyle.borderColor).toEqual(theme.colors.black10)
  expect(component.root.findAllByType(CheckMark).length).toEqual(0)
  expect(component.root.findAllByType(DisabledMark).length).toEqual(0)
})

it("shows a black border and black background if it is disabled but checked", () => {
  const component = renderWithWrappers(<Checkbox disabled checked />)

  const checkboxStyle = component.root.findByType(CssTransition).props.style[1]

  expect(checkboxStyle.backgroundColor).toEqual(theme.colors.black5)
  expect(checkboxStyle.borderColor).toEqual(theme.colors.black10)
  expect(component.root.findAllByType(DisabledMark).length).toEqual(1)
})
