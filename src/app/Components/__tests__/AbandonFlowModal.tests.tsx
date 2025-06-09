import { fireEvent, screen } from "@testing-library/react-native"
import { AbandonFlowModal } from "app/Components/AbandonFlowModal"
import { popToRoot } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/system/navigation/navigate", () => ({
  popToRoot: jest.fn(),
}))

describe("AbandonFlowModal", () => {
  const mockProps = {
    isVisible: true,
    title: "Test Title",
    subtitle: "Test Subtitle",
    leaveButtonTitle: "Leave",
    continueButtonTitle: "Continue",
    onDismiss: jest.fn(),
    onLeave: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders correctly with all props", () => {
    renderWithWrappers(<AbandonFlowModal {...mockProps} />)

    expect(screen.getByText("Test Title")).toBeTruthy()
    expect(screen.getByText("Test Subtitle")).toBeTruthy()
    expect(screen.getByText("Leave")).toBeTruthy()
    expect(screen.getByText("Continue")).toBeTruthy()
  })

  it("calls onDismiss when continue button is pressed", () => {
    renderWithWrappers(<AbandonFlowModal {...mockProps} />)

    fireEvent.press(screen.getByText("Continue"))
    expect(mockProps.onDismiss).toHaveBeenCalledTimes(1)
  })

  it("calls onLeave when leave button is pressed and onLeave is provided", () => {
    renderWithWrappers(<AbandonFlowModal {...mockProps} />)

    fireEvent.press(screen.getByText("Leave"))
    expect(mockProps.onLeave).toHaveBeenCalledTimes(1)
    expect(popToRoot).not.toHaveBeenCalled()
  })

  it("calls popToRoot when leave button is pressed and onLeave is not provided", () => {
    renderWithWrappers(<AbandonFlowModal {...mockProps} onLeave={undefined} />)

    fireEvent.press(screen.getByText("Leave"))
    expect(popToRoot).toHaveBeenCalledTimes(1)
  })
})
