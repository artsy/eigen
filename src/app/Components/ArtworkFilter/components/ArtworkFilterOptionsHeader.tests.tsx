import { fireEvent } from "@testing-library/react-native"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import {
  ArtworkFilterOptionsHeader,
  ArtworkFilterOptionsHeaderProps,
} from "./ArtworkFilterOptionsHeader"

const defaultProps: ArtworkFilterOptionsHeaderProps = {
  title: "Title",
  rightButtonDisabled: false,
  onLeftButtonPress: jest.fn,
  onRightButtonPress: jest.fn,
}

describe("ArtworkFilterOptionsHeader", () => {
  const TestWrapper = (props?: Partial<ArtworkFilterOptionsHeaderProps>) => {
    return <ArtworkFilterOptionsHeader {...defaultProps} {...props} />
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

  it("should disable right button when rightButtonDisabled prop is true", () => {
    const { getByText } = renderWithWrappersTL(<TestWrapper rightButtonDisabled />)

    expect(getByText("Clear")).toBeDisabled()
  })

  it('should call "onLeftButtonPress" handler when back button is pressed', () => {
    const onLeftButtonPressMock = jest.fn()
    const { getByA11yLabel } = renderWithWrappersTL(
      <TestWrapper onLeftButtonPress={onLeftButtonPressMock} />
    )

    fireEvent.press(getByA11yLabel("Header back button"))

    expect(onLeftButtonPressMock).toBeCalled()
  })

  it('should call "onRightButtonPress" handler when clear all is pressed', () => {
    const onRightButtonPressMock = jest.fn()
    const { getByText } = renderWithWrappersTL(
      <TestWrapper onRightButtonPress={onRightButtonPressMock} />
    )

    fireEvent.press(getByText("Clear"))

    expect(onRightButtonPressMock).toBeCalled()
  })
})
