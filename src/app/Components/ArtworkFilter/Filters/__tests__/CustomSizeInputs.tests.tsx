import { fireEvent, screen } from "@testing-library/react-native"
import {
  CustomSizeInputs,
  CustomSizeInputsProps,
} from "app/Components/ArtworkFilter/Filters/CustomSizeInputs"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("CustomSizeInputs", () => {
  const TestRenderer = (props: Partial<CustomSizeInputsProps>) => {
    return (
      <CustomSizeInputs
        label="Label"
        range={{ min: "*", max: "*" }}
        onChange={jest.fn}
        selectedMetric="in"
        {...props}
      />
    )
  }

  it("renders without throwing an error", () => {
    renderWithWrappers(<TestRenderer />)

    expect(screen.getByText("Label")).toBeTruthy()
    expect(screen.getByLabelText("Minimum Label Input")).toBeTruthy()
    expect(screen.getByLabelText("Maximum Label Input")).toBeTruthy()
  })

  it("should correctly render initial values", () => {
    renderWithWrappers(<TestRenderer range={{ min: 5, max: 10 }} />)

    expect(screen.getByDisplayValue("5")).toBeTruthy()
    expect(screen.getByDisplayValue("10")).toBeTruthy()
  })

  it("should allow to enter integer values", () => {
    const mockOnChange = jest.fn()
    renderWithWrappers(<TestRenderer onChange={mockOnChange} />)

    // Min input
    fireEvent.changeText(screen.getByLabelText("Minimum Label Input"), "5")
    expect(screen.getByDisplayValue("5")).toBeTruthy()
    expect(mockOnChange).toBeCalledWith({
      min: 5,
      max: "*",
    })

    // Max input
    fireEvent.changeText(screen.getByLabelText("Maximum Label Input"), "10")
    expect(screen.getByDisplayValue("10")).toBeTruthy()
    expect(mockOnChange).toBeCalledWith({
      min: "*",
      max: 10,
    })
  })

  it("should allow to enter floating point values", () => {
    const mockOnChange = jest.fn()
    renderWithWrappers(<TestRenderer onChange={mockOnChange} />)

    // Min input
    fireEvent.changeText(screen.getByLabelText("Minimum Label Input"), "5.55")
    expect(screen.getByDisplayValue("5.55")).toBeTruthy()
    expect(mockOnChange).toBeCalledWith({
      min: 5.55,
      max: "*",
    })

    // Max input
    fireEvent.changeText(screen.getByLabelText("Maximum Label Input"), "10.55")
    expect(screen.getByDisplayValue("10.55")).toBeTruthy()
    expect(mockOnChange).toBeCalledWith({
      min: "*",
      max: 10.55,
    })
  })

  it("should allow to enter only 2 digits after floating point", () => {
    const mockOnChange = jest.fn()
    renderWithWrappers(<TestRenderer onChange={mockOnChange} range={{ min: 1, max: 2 }} />)

    // Min input
    fireEvent.changeText(screen.getByLabelText("Minimum Label Input"), "5.5555")
    expect(screen.getByDisplayValue("1")).toBeTruthy()
    expect(mockOnChange).toBeCalledTimes(0)

    // Max input
    fireEvent.changeText(screen.getByLabelText("Maximum Label Input"), "10.5555")
    expect(screen.getByDisplayValue("2")).toBeTruthy()
    expect(mockOnChange).toBeCalledTimes(0)
  })

  it("should NOT allow to enter values with special chars", () => {
    const mockOnChange = jest.fn()
    renderWithWrappers(<TestRenderer onChange={mockOnChange} range={{ min: 1, max: 2 }} />)

    // Min input
    fireEvent.changeText(screen.getByLabelText("Minimum Label Input"), "#5.55")
    expect(screen.getByDisplayValue("1")).toBeTruthy()
    expect(mockOnChange).toBeCalledTimes(0)

    fireEvent.changeText(screen.getByLabelText("Minimum Label Input"), "5,55")
    expect(screen.getByDisplayValue("1")).toBeTruthy()
    expect(mockOnChange).toBeCalledTimes(0)

    fireEvent.changeText(screen.getByLabelText("Minimum Label Input"), "5#55")
    expect(screen.getByDisplayValue("1")).toBeTruthy()
    expect(mockOnChange).toBeCalledTimes(0)

    fireEvent.changeText(screen.getByLabelText("Minimum Label Input"), "5.55%")
    expect(screen.getByDisplayValue("1")).toBeTruthy()
    expect(mockOnChange).toBeCalledTimes(0)

    // Max input
    fireEvent.changeText(screen.getByLabelText("Minimum Label Input"), "#5.55")
    expect(screen.getByDisplayValue("2")).toBeTruthy()
    expect(mockOnChange).toBeCalledTimes(0)

    fireEvent.changeText(screen.getByLabelText("Minimum Label Input"), "5,55")
    expect(screen.getByDisplayValue("2")).toBeTruthy()
    expect(mockOnChange).toBeCalledTimes(0)

    fireEvent.changeText(screen.getByLabelText("Minimum Label Input"), "5#55")
    expect(screen.getByDisplayValue("2")).toBeTruthy()
    expect(mockOnChange).toBeCalledTimes(0)

    fireEvent.changeText(screen.getByLabelText("Minimum Label Input"), "5.55%")
    expect(screen.getByDisplayValue("2")).toBeTruthy()
    expect(mockOnChange).toBeCalledTimes(0)
  })

  it("should call handler when the minimum value is changed", () => {
    const onChangeMock = jest.fn()
    renderWithWrappers(<TestRenderer onChange={onChangeMock} />)

    fireEvent.changeText(screen.getByLabelText("Minimum Label Input"), "5")

    expect(onChangeMock).toBeCalledWith({ min: 5, max: "*" })
  })

  it("should call handler when the maximum value is changed", () => {
    const onChangeMock = jest.fn()
    renderWithWrappers(<TestRenderer onChange={onChangeMock} />)

    fireEvent.changeText(screen.getByLabelText("Maximum Label Input"), "10")

    expect(onChangeMock).toBeCalledWith({ min: "*", max: 10 })
  })

  it("should NOT call `onChange` handler if a non-floating point or non-integer value is entered in the input", () => {
    const onChangeMock = jest.fn()
    renderWithWrappers(<TestRenderer onChange={onChangeMock} />)

    fireEvent.changeText(screen.getByLabelText("Maximum Label Input"), "hello")

    expect(onChangeMock).toBeCalledTimes(0)
  })
})
