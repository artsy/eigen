import { fireEvent } from "@testing-library/react-native"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { Button } from "../Button"

describe(Button, () => {
  it("spinner doesn't show up when not loading", () => {
    const { queryAllByTestId } = renderWithWrappersTL(<Button>Hi</Button>)

    expect(queryAllByTestId("spinner")).toHaveLength(0)
  })

  it("shows spinner if loading is true", () => {
    const { queryAllByTestId } = renderWithWrappersTL(<Button loading>Hi</Button>)

    expect(queryAllByTestId("spinner")).toHaveLength(1)
  })

  it("invokes the onClick callback", () => {
    const onPress = jest.fn()

    const { container: button } = renderWithWrappersTL(<Button onPress={onPress}>Hi</Button>)

    fireEvent.press(button)

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it("does not invoke the onClick callback if loading is true", () => {
    const onPress = jest.fn()

    const { container: button } = renderWithWrappersTL(
      <Button onPress={onPress} loading>
        Hi
      </Button>
    )

    fireEvent.press(button)

    expect(onPress).toHaveBeenCalledTimes(0)
  })

  it("does not invoke the onClick callback if disabled is true", () => {
    const onPress = jest.fn()

    const { UNSAFE_getByType } = renderWithWrappersTL(
      <Button onPress={onPress} disabled>
        Hi
      </Button>
    )

    const button = UNSAFE_getByType(TouchableWithoutFeedback)
    fireEvent.press(button)

    expect(onPress).toHaveBeenCalledTimes(0)
  })
})
