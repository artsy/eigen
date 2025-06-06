import { fireEvent, screen } from "@testing-library/react-native"
import { SwitchMenu } from "app/Components/SwitchMenu"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("SwitchMenu", () => {
  const defaultProps = {
    onChange: jest.fn(),
    value: false,
    title: "Test Title",
    description: "Test Description",
    testID: "test-switch",
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders with the provided title and description", () => {
    renderWithWrappers(<SwitchMenu {...defaultProps} />)

    expect(screen.getByText("Test Title")).toBeTruthy()
    expect(screen.getByText("Test Description")).toBeTruthy()
  })

  it("renders with the correct switch value", () => {
    renderWithWrappers(<SwitchMenu {...defaultProps} value={true} />)

    const switchComponent = screen.getByTestId("test-switch")
    expect(switchComponent.props.value).toBe(true)
  })

  it("calls onChange when switch is toggled", () => {
    renderWithWrappers(<SwitchMenu {...defaultProps} />)

    const switchComponent = screen.getByTestId("test-switch")
    fireEvent(switchComponent, "valueChange", true)

    expect(defaultProps.onChange).toHaveBeenCalledWith(true)
  })

  it("renders in disabled state when specified", () => {
    renderWithWrappers(<SwitchMenu {...defaultProps} disabled />)

    const switchComponent = screen.getByTestId("test-switch")
    expect(switchComponent.props.disabled).toBe(true)

    // Text colors should be different in disabled state
    const titleText = screen.getByText("Test Title")
    const descriptionText = screen.getByText("Test Description")

    expect(titleText.props.color).toBe("mono60")
    expect(descriptionText.props.color).toBe("mono30")
  })
})
