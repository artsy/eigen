import { fireEvent, screen } from "@testing-library/react-native"
import {
  ArtworkFilterApplyButton,
  ArtworkFilterApplyButtonProps,
} from "app/Components/ArtworkFilter/components/ArtworkFilterApplyButton"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const defaultProps: ArtworkFilterApplyButtonProps = {
  onCreateAlertPress: jest.fn,
  onPress: jest.fn,
}

describe("ArtworkFilterApplyButton", () => {
  const TestWrapper = (props?: Partial<ArtworkFilterApplyButtonProps>) => {
    return <ArtworkFilterApplyButton {...defaultProps} {...props} />
  }

  it('should call "onPress" handler when it is pressed', () => {
    const onPressMock = jest.fn()
    renderWithWrappers(<TestWrapper onPress={onPressMock} />)

    fireEvent.press(screen.getByText("Show Results"))

    expect(onPressMock).toBeCalled()
  })

  it('should show "Create Alert" button only when shouldShowCreateAlertButton prop is specified', () => {
    renderWithWrappers(<TestWrapper shouldShowCreateAlertButton />)

    expect(screen.getByText("Create Alert")).toBeTruthy()
  })

  it('should call "onCreateAlertPress" handler when "Create Alert" is pressed', () => {
    const onCreateAlertPressMock = jest.fn()
    renderWithWrappers(
      <TestWrapper shouldShowCreateAlertButton onCreateAlertPress={onCreateAlertPressMock} />
    )

    fireEvent.press(screen.getByText("Create Alert"))

    expect(onCreateAlertPressMock).toBeCalled()
  })
})
