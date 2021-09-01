import { fireEvent } from "@testing-library/react-native"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { OpaqueImageViewContainer } from ".."
import { Pill } from "../Pill"

it("returns empty holder if no image url or initials", () => {
  const { container } = renderWithWrappersTL(<Pill />)

  expect(container.findAllByType(OpaqueImageViewContainer).length).toBe(0)
})

it("invokes the onClick callback", () => {
  const onPress = jest.fn()

  const { getByTestId } = renderWithWrappersTL(
    <Pill testID="the-pill" onPress={onPress}>
      wow
    </Pill>
  )

  fireEvent.press(getByTestId("the-pill"))

  expect(onPress).toHaveBeenCalled()
})

it("invokes the onClick callback on rounded pill", () => {
  const onPress = jest.fn()

  const { getByTestId } = renderWithWrappersTL(
    <Pill testID="the-pill" onPress={onPress} rounded>
      wow
    </Pill>
  )

  fireEvent.press(getByTestId("the-pill"))

  expect(onPress).toHaveBeenCalled()
})
