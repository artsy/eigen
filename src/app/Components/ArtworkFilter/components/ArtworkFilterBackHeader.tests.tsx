import { fireEvent } from "@testing-library/react-native"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { ArtworkFilterBackHeader, ArtworkFilterBackHeaderProps } from "./ArtworkFilterBackHeader"

const defaultProps: ArtworkFilterBackHeaderProps = {
  title: "Title",
  onLeftButtonPress: jest.fn,
}

describe("ArtworkFilterBackHeader", () => {
  const TestRenderer = (props?: Partial<ArtworkFilterBackHeaderProps>) => {
    return <ArtworkFilterBackHeader {...defaultProps} {...props} />
  }

  it("renders without throwing an error", () => {
    const { getByText, getByLabelText } = renderWithWrappersTL(<TestRenderer />)

    expect(getByText("Title")).toBeTruthy()
    expect(getByLabelText("Header back button")).toBeTruthy()
  })

  it('should call "onLeftButtonPress" handler when left button is pressed', () => {
    const onLeftButtonPressMock = jest.fn()
    const { getByLabelText } = renderWithWrappersTL(
      <TestRenderer onLeftButtonPress={onLeftButtonPressMock} />
    )

    fireEvent.press(getByLabelText("Header back button"))

    expect(onLeftButtonPressMock).toBeCalled()
  })

  it("should render right button if all required props are passed", () => {
    const { getByLabelText } = renderWithWrappersTL(
      <TestRenderer rightButtonText="Right button" onRightButtonPress={jest.fn} />
    )

    expect(getByLabelText("Header right button")).toBeTruthy()
  })

  it('should call "onRightButtonPress" handler when right button is pressed', () => {
    const onRightButtonPressMock = jest.fn()
    const { getByLabelText } = renderWithWrappersTL(
      <TestRenderer rightButtonText="Right button" onRightButtonPress={onRightButtonPressMock} />
    )

    fireEvent.press(getByLabelText("Header right button"))

    expect(onRightButtonPressMock).toBeCalled()
  })
})
