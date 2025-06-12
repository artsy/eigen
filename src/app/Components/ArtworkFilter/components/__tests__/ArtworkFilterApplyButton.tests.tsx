import { fireEvent } from "@testing-library/react-native"
import {
  ArtworkFilterApplyButton,
  ArtworkFilterApplyButtonProps,
} from "app/Components/ArtworkFilter/components/ArtworkFilterApplyButton"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const defaultProps: ArtworkFilterApplyButtonProps = {
  disabled: false,
  onCreateAlertPress: jest.fn,
  onPress: jest.fn,
}

describe("ArtworkFilterApplyButton", () => {
  const TestWrapper = (props?: Partial<ArtworkFilterApplyButtonProps>) => {
    return <ArtworkFilterApplyButton {...defaultProps} {...props} />
  }

  it("cannot press if disabled prop is passed", () => {
    const onPressMock = jest.fn()
    const { getByText } = renderWithWrappers(<TestWrapper disabled />)
    const button = getByText("Show Results")

    fireEvent.press(button)

    expect(button).toBeDisabled()
    expect(onPressMock).not.toBeCalled()
  })

  it('should call "onPress" handler when it is pressed', () => {
    const onPressMock = jest.fn()
    const { getByText } = renderWithWrappers(<TestWrapper onPress={onPressMock} />)

    fireEvent.press(getByText("Show Results"))

    expect(onPressMock).toBeCalled()
  })

  it('should show "Create Alert" button only when shouldShowCreateAlertButton prop is specified', () => {
    const { getByText } = renderWithWrappers(<TestWrapper shouldShowCreateAlertButton />)

    expect(getByText("Create Alert")).toBeTruthy()
  })

  it('should call "onCreateAlertPress" handler when "Create Alert" is pressed', () => {
    const onCreateAlertPressMock = jest.fn()
    const { getByText } = renderWithWrappers(
      <TestWrapper shouldShowCreateAlertButton onCreateAlertPress={onCreateAlertPressMock} />
    )

    fireEvent.press(getByText("Create Alert"))

    expect(onCreateAlertPressMock).toBeCalled()
  })
})
