import { fireEvent } from "@testing-library/react-native"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { Header, HeaderProps } from "./Header"

const defaultProps: HeaderProps = {
  onLeftButtonPress: jest.fn,
}

describe("Header", () => {
  const TestRenderer = (props?: Partial<HeaderProps>) => {
    return <Header {...defaultProps} {...props} />
  }

  it("renders without throwing an error", () => {
    const { getByA11yLabel } = renderWithWrappersTL(<TestRenderer />)

    expect(getByA11yLabel("Header back button")).toBeTruthy()
  })

  it("should render passed title", () => {
    const { getByText } = renderWithWrappersTL(<TestRenderer title="Custom Title" />)

    expect(getByText("Custom Title")).toBeTruthy()
  })

  it('should call "onLeftButtonPress" handler when left button is pressed', () => {
    const onLeftButtonPressMock = jest.fn()
    const { getByA11yLabel } = renderWithWrappersTL(<TestRenderer onLeftButtonPress={onLeftButtonPressMock} />)

    fireEvent.press(getByA11yLabel("Header back button"))

    expect(onLeftButtonPressMock).toBeCalled()
  })

  it("should render right button if all required props are passed", () => {
    const { getByA11yLabel } = renderWithWrappersTL(
      <TestRenderer rightButtonText="Right button" onRightButtonPress={jest.fn} />
    )

    expect(getByA11yLabel("Header right button")).toBeTruthy()
  })

  it('should call "onRightButtonPress" handler when right button is pressed', () => {
    const onRightButtonPressMock = jest.fn()
    const { getByA11yLabel } = renderWithWrappersTL(
      <TestRenderer rightButtonText="Right button" onRightButtonPress={onRightButtonPressMock} />
    )

    fireEvent.press(getByA11yLabel("Header right button"))

    expect(onRightButtonPressMock).toBeCalled()
  })
})
