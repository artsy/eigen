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

  it('should call "onPress" handler when it is pressed', async () => {
    const onPressMock = jest.fn()
    await renderWithWrappers(<TestWrapper onPress={onPressMock} />)

    await fireEvent.press(screen.getByText("Show Results"))

    expect(onPressMock).toBeCalled()
  })

  it('should show "Create Alert" button only when shouldShowCreateAlertButton prop is specified', async () => {
    await renderWithWrappers(<TestWrapper shouldShowCreateAlertButton />)

    expect(screen.getByText("Create Alert")).toBeTruthy()
  })

  it('should call "onCreateAlertPress" handler when "Create Alert" is pressed', async () => {
    const onCreateAlertPressMock = jest.fn()
    await renderWithWrappers(
      <TestWrapper shouldShowCreateAlertButton onCreateAlertPress={onCreateAlertPressMock} />
    )

    await fireEvent.press(screen.getByText("Create Alert"))

    expect(onCreateAlertPressMock).toBeCalled()
  })
})
