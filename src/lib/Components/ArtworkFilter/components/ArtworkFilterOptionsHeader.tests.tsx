import { fireEvent } from "@testing-library/react-native"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { ArtworkFilterOptionsHeader, ArtworkFilterOptionsHeaderProps } from "./ArtworkFilterOptionsHeader"

const defaultProps: ArtworkFilterOptionsHeaderProps = {
  title: "Title",
  isClearAllButtonEnabled: true,
  onClosePress: jest.fn,
  onClearAllPress: jest.fn,
}

describe("ArtworkFilterOptionsHeader", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableImprovedAlertsFlow: true })
  })

  const TestWrapper = (props?: Partial<ArtworkFilterOptionsHeaderProps>) => {
    return <ArtworkFilterOptionsHeader {...defaultProps} {...props} />
  }

  it("should render title", () => {
    const { getByText } = renderWithWrappersTL(<TestWrapper title="Custom Title" />)

    expect(getByText("Custom Title")).toBeTruthy()
  })

  it('should disable "Clear All" button when isClearAllButtonEnabled prop is false', () => {
    const { getByText } = renderWithWrappersTL(<TestWrapper isClearAllButtonEnabled={false} />)

    expect(getByText("Clear All")).toBeDisabled()
  })

  it('should call "onClosePress" handler when back button is pressed', () => {
    const onClosePressMock = jest.fn()
    const { getByTestId } = renderWithWrappersTL(<TestWrapper onClosePress={onClosePressMock} />)

    fireEvent.press(getByTestId("fancy-modal-header-left-button"))

    expect(onClosePressMock).toBeCalled()
  })

  it('should call "onClearAllPress" handler when clear all is pressed', () => {
    const onClearAllPressMock = jest.fn()
    const { getByText } = renderWithWrappersTL(<TestWrapper onClearAllPress={onClearAllPressMock} />)

    fireEvent.press(getByText("Clear All"))

    expect(onClearAllPressMock).toBeCalled()
  })
})
