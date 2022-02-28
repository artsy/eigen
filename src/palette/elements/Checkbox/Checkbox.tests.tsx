import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { Text } from "palette"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { Checkbox } from "./Checkbox"

it("shows text and subtitle within the checkbox", () => {
  const component = renderWithWrappers(<Checkbox text="Remember me" subtitle="Subtitle" />)

  expect(component.root.findAllByType(Text).length).toEqual(2)
  expect(component.root.findAllByType(Text)[0].props.children).toEqual("Remember me")
  expect(component.root.findAllByType(Text)[1].props.children).toEqual("Subtitle")
})

it("calls onPress when tapped", () => {
  const onPress = jest.fn()

  const component = renderWithWrappers(<Checkbox onPress={onPress} />)

  component.root.findByType(TouchableWithoutFeedback).props.onPress()

  expect(onPress).toHaveBeenCalled()
})
