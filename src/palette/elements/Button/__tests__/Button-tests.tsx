import { fireEvent } from "@testing-library/react-native"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { Button, ButtonProps } from "../Button"

describe("Button", () => {
  const TestComponent = (props: Partial<ButtonProps>) => <Button {...props}>Hi</Button>

  it("spinner doesn't show up when not loading", () => {
    const { queryAllByTestId } = renderWithWrappersTL(<TestComponent />)

    expect(queryAllByTestId("spinner")).toHaveLength(0)
  })

  it("shows spinner if loading is true", () => {
    const { queryAllByTestId } = renderWithWrappersTL(<TestComponent loading />)

    expect(queryAllByTestId("spinner")).toHaveLength(1)
  })

  it("invokes the onClick callback", () => {
    const onPress = jest.fn()

    const { UNSAFE_getByType } = renderWithWrappersTL(<TestComponent onPress={onPress} />)

    const button = UNSAFE_getByType(TouchableWithoutFeedback)
    fireEvent.press(button)

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it("does not invoke the onClick callback if loading is true", () => {
    const onPress = jest.fn()

    const { UNSAFE_getByType } = renderWithWrappersTL(<TestComponent onPress={onPress} loading />)

    const button = UNSAFE_getByType(TouchableWithoutFeedback)
    fireEvent.press(button)

    expect(onPress).toHaveBeenCalledTimes(0)
  })

  it("does not invoke the onClick callback if disabled is true", () => {
    const onPress = jest.fn()

    const { UNSAFE_getByType } = renderWithWrappersTL(<TestComponent onPress={onPress} disabled />)

    const button = UNSAFE_getByType(TouchableWithoutFeedback)
    fireEvent.press(button)

    expect(onPress).toHaveBeenCalledTimes(0)
  })
})
