import { fireEvent } from "@testing-library/react-native"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { ArtworkFilterApplyButton, ArtworkFilterApplyButtonProps } from "./ArtworkFilterApplyButton"

const defaultProps: ArtworkFilterApplyButtonProps = {
  disabled: false,
  onPress: jest.fn,
}

describe("ArtworkFilterApplyButton", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableImprovedAlertsFlow: true })
  })

  const TestWrapper = (props?: Partial<ArtworkFilterApplyButtonProps>) => {
    return <ArtworkFilterApplyButton {...defaultProps} {...props} />
  }

  it("cannot press if disabled prop is passed", () => {
    const onPressMock = jest.fn()
    const { getAllByText } = renderWithWrappersTL(<TestWrapper disabled />)
    const button = getAllByText("Apply Filters")[0]

    fireEvent.press(button)

    expect(button).toBeDisabled()
    expect(onPressMock).not.toBeCalled()
  })

  it('should call "onPress" handle when it is pressed', () => {
    const onPressMock = jest.fn()
    const { getAllByText } = renderWithWrappersTL(<TestWrapper onPress={onPressMock} />)

    fireEvent.press(getAllByText("Apply Filters")[0])

    expect(onPressMock).toBeCalled()
  })
})
