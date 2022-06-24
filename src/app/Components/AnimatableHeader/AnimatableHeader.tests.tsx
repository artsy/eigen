import { fireEvent } from "@testing-library/react-native"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { AnimatableHeader, AnimatableHeaderProps } from "./AnimatableHeader"

const defaultProps: AnimatableHeaderProps = {
  title: "Title",
  rightButtonDisabled: false,
  rightButtonText: "Right button",
  onLeftButtonPress: jest.fn,
  onRightButtonPress: jest.fn,
}

describe("AnimatableHeader", () => {
  const TestWrapper = (props?: Partial<AnimatableHeaderProps>) => {
    return <AnimatableHeader {...defaultProps} {...props} />
  }

  it("should render title", () => {
    const { getByText } = renderWithWrappersTL(<TestWrapper title="Custom Title" />)

    expect(getByText("Custom Title")).toBeTruthy()
  })

  it("should render passed rightButtonText prop", () => {
    const { getByText } = renderWithWrappersTL(
      <TestWrapper rightButtonText="Custom Right Button Text" />
    )

    expect(getByText("Custom Right Button Text")).toBeTruthy()
  })

  it('should hide right button if "onRightButtonPress" is not passed', () => {
    const { queryByText } = renderWithWrappersTL(
      <TestWrapper onRightButtonPress={undefined} rightButtonText="Right Button" />
    )

    expect(queryByText("Right Button")).toBeFalsy()
  })

  it('should hide right button if "rightButtonText" is not passed', () => {
    const { queryByText } = renderWithWrappersTL(
      <TestWrapper onRightButtonPress={jest.fn} rightButtonText={undefined} />
    )

    expect(queryByText("Right button")).toBeFalsy()
  })

  it("should disable right button when rightButtonDisabled prop is true", () => {
    const { getByText } = renderWithWrappersTL(<TestWrapper rightButtonDisabled />)

    expect(getByText("Right button")).toBeDisabled()
  })

  it('should call "onLeftButtonPress" handler when back button is pressed', () => {
    const onLeftButtonPressMock = jest.fn()
    const { getByLabelText } = renderWithWrappersTL(
      <TestWrapper onLeftButtonPress={onLeftButtonPressMock} />
    )

    fireEvent.press(getByLabelText("Header back button"))

    expect(onLeftButtonPressMock).toBeCalled()
  })

  it('should call "onRightButtonPress" handler when right button is pressed', () => {
    const onRightButtonPressMock = jest.fn()
    const { getByText } = renderWithWrappersTL(
      <TestWrapper onRightButtonPress={onRightButtonPressMock} />
    )

    fireEvent.press(getByText("Right button"))

    expect(onRightButtonPressMock).toBeCalled()
  })
})
