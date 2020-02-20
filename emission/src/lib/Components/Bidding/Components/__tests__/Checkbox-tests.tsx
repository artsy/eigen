import { Serif } from "@artsy/palette"
import React from "react"
import * as renderer from "react-test-renderer"

import { TouchableWithoutFeedback } from "react-native"
import { theme } from "../../Elements/Theme"
import { CssTransition } from "../Animation/CssTransition"
import { BiddingThemeProvider } from "../BiddingThemeProvider"
import { Checkbox, CheckMark, DisabledMark } from "../Checkbox"

it("shows children within the checkbox", () => {
  const component = renderer.create(
    <BiddingThemeProvider>
      <Checkbox>
        <Serif size="2">Remember me</Serif>
      </Checkbox>
    </BiddingThemeProvider>
  )

  expect(component.root.findAllByType(Serif).length).toEqual(1)
})

it("calls onPress when tapped", done => {
  let clicked: boolean
  const onPress = () => (clicked = true)

  const component = renderer.create(
    <BiddingThemeProvider>
      <Checkbox onPress={onPress} />
    </BiddingThemeProvider>
  )

  component.root.findByType(TouchableWithoutFeedback).props.onPress()

  // The onPress() call above is an async call so the assertion call needs to be sent to the end of the event loop
  setTimeout(() => {
    expect(clicked).toEqual(true)
    done()
  }, 0)
})

it("shows a gray border and white background by default", () => {
  const component = renderer.create(
    <BiddingThemeProvider>
      <Checkbox />
    </BiddingThemeProvider>
  )

  const checkboxStyle = component.root.findByType(CssTransition).props.style[1]

  expect(checkboxStyle.backgroundColor).toEqual(theme.colors.white100)
  expect(checkboxStyle.borderColor).toEqual(theme.colors.black10)
})

it("shows a black border and black background if checked is true", () => {
  const component = renderer.create(
    <BiddingThemeProvider>
      <Checkbox error checked />
    </BiddingThemeProvider>
  )

  const checkboxStyle = component.root.findByType(CssTransition).props.style[1]

  expect(checkboxStyle.backgroundColor).toEqual(theme.colors.black100)
  expect(checkboxStyle.borderColor).toEqual(theme.colors.black100)
})

it("shows a purple border and white background if error is true", () => {
  const component = renderer.create(
    <BiddingThemeProvider>
      <Checkbox error />
    </BiddingThemeProvider>
  )

  const checkboxStyle = component.root.findByType(CssTransition).props.style[1]

  expect(checkboxStyle.backgroundColor).toEqual(theme.colors.white100)
  expect(checkboxStyle.borderColor).toEqual(theme.colors.red100)
})

it("shows a black border and black background if both error and checked are true", () => {
  const component = renderer.create(
    <BiddingThemeProvider>
      <Checkbox error checked />
    </BiddingThemeProvider>
  )

  const checkboxStyle = component.root.findByType(CssTransition).props.style[1]

  expect(checkboxStyle.backgroundColor).toEqual(theme.colors.black100)
  expect(checkboxStyle.borderColor).toEqual(theme.colors.black100)
})

it("shows a gray border and background if it is disabled", () => {
  const component = renderer.create(
    <BiddingThemeProvider>
      <Checkbox disabled />
    </BiddingThemeProvider>
  )

  const checkboxStyle = component.root.findByType(CssTransition).props.style[1]

  expect(checkboxStyle.backgroundColor).toEqual(theme.colors.black5)
  expect(checkboxStyle.borderColor).toEqual(theme.colors.black10)
  expect(component.root.findAllByType(CheckMark).length).toEqual(0)
  expect(component.root.findAllByType(DisabledMark).length).toEqual(0)
})

it("shows a black border and black background if it is disabled but checked", () => {
  const component = renderer.create(
    <BiddingThemeProvider>
      <Checkbox disabled checked />
    </BiddingThemeProvider>
  )

  const checkboxStyle = component.root.findByType(CssTransition).props.style[1]

  expect(checkboxStyle.backgroundColor).toEqual(theme.colors.black5)
  expect(checkboxStyle.borderColor).toEqual(theme.colors.black10)
  expect(component.root.findAllByType(DisabledMark).length).toEqual(1)
})
