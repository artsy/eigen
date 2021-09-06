import { fireEvent } from "@testing-library/react-native"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { Pill } from "../Pill"

describe("<Pill />", () => {
  it("invokes the onClick callback", () => {
    const onPress = jest.fn()

    const { getByText } = renderWithWrappersTL(<Pill onPress={onPress}>wow</Pill>)

    fireEvent.press(getByText("wow"))
    expect(onPress).toHaveBeenCalled()
  })
})
