import { fireEvent } from "@testing-library/react-native"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { Pill } from "./Pill"

describe("<Pill />", () => {
  it("invokes the onClick callback", () => {
    const onPress = jest.fn()

    const { getByText } = renderWithWrappersTL(<Pill onPress={onPress}>wow</Pill>)

    fireEvent.press(getByText("wow"))
    expect(onPress).toHaveBeenCalled()
  })

  it("should not be pressable if disabled is passed", () => {
    const onPress = jest.fn()

    const { getByText } = renderWithWrappersTL(
      <Pill disabled onPress={onPress}>
        Press me
      </Pill>
    )

    fireEvent.press(getByText("Press me"))
    expect(onPress).not.toHaveBeenCalled()
  })
})
