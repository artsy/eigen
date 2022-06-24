import { fireEvent } from "@testing-library/react-native"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { CustomSizeInputs, CustomSizeInputsProps } from "./CustomSizeInputs"

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
    const { getByText, getByLabelText } = renderWithWrappersTL(<TestRenderer />)

    expect(getByText("Label")).toBeTruthy()
    expect(getByLabelText("Minimum Label Input")).toBeTruthy()
    expect(getByLabelText("Maximum Label Input")).toBeTruthy()
  })

  it("should correctly render initial values", () => {
    const { getByDisplayValue } = renderWithWrappersTL(<TestRenderer range={{ min: 5, max: 10 }} />)

    expect(getByDisplayValue("5")).toBeTruthy()
    expect(getByDisplayValue("10")).toBeTruthy()
  })

  it("should allow to enter integer values", () => {
    const mockOnChange = jest.fn()
    const { getByDisplayValue, getByLabelText } = renderWithWrappersTL(
      <TestRenderer onChange={mockOnChange} />
    )

    // Min input
    fireEvent.changeText(getByLabelText("Minimum Label Input"), "5")
    expect(getByDisplayValue("5")).toBeTruthy()
    expect(mockOnChange).toBeCalledWith({
      min: 5,
      max: "*",
    })

    // Max input
    fireEvent.changeText(getByLabelText("Maximum Label Input"), "10")
    expect(getByDisplayValue("10")).toBeTruthy()
    expect(mockOnChange).toBeCalledWith({
      min: "*",
      max: 10,
    })
  })

  it("should allow to enter floating point values", () => {
    const mockOnChange = jest.fn()
    const { getByDisplayValue, getByLabelText } = renderWithWrappersTL(
      <TestRenderer onChange={mockOnChange} />
    )

    // Min input
    fireEvent.changeText(getByLabelText("Minimum Label Input"), "5.55")
    expect(getByDisplayValue("5.55")).toBeTruthy()
    expect(mockOnChange).toBeCalledWith({
      min: 5.55,
      max: "*",
    })

    // Max input
    fireEvent.changeText(getByLabelText("Maximum Label Input"), "10.55")
    expect(getByDisplayValue("10.55")).toBeTruthy()
    expect(mockOnChange).toBeCalledWith({
      min: "*",
      max: 10.55,
    })
  })

  it("should allow to enter only 2 digits after floating point", () => {
    const mockOnChange = jest.fn()
    const { getByDisplayValue, getByLabelText } = renderWithWrappersTL(
      <TestRenderer onChange={mockOnChange} range={{ min: 1, max: 2 }} />
    )

    // Min input
    fireEvent.changeText(getByLabelText("Minimum Label Input"), "5.5555")
    expect(getByDisplayValue("1")).toBeTruthy()
    expect(mockOnChange).toBeCalledTimes(0)

    // Max input
    fireEvent.changeText(getByLabelText("Maximum Label Input"), "10.5555")
    expect(getByDisplayValue("2")).toBeTruthy()
    expect(mockOnChange).toBeCalledTimes(0)
  })

  it("should NOT allow to enter values with special chars", () => {
    const mockOnChange = jest.fn()
    const { getByDisplayValue, getByLabelText } = renderWithWrappersTL(
      <TestRenderer onChange={mockOnChange} range={{ min: 1, max: 2 }} />
    )

    // Min input
    fireEvent.changeText(getByLabelText("Minimum Label Input"), "#5.55")
    expect(getByDisplayValue("1")).toBeTruthy()
    expect(mockOnChange).toBeCalledTimes(0)

    fireEvent.changeText(getByLabelText("Minimum Label Input"), "5,55")
    expect(getByDisplayValue("1")).toBeTruthy()
    expect(mockOnChange).toBeCalledTimes(0)

    fireEvent.changeText(getByLabelText("Minimum Label Input"), "5#55")
    expect(getByDisplayValue("1")).toBeTruthy()
    expect(mockOnChange).toBeCalledTimes(0)

    fireEvent.changeText(getByLabelText("Minimum Label Input"), "5.55%")
    expect(getByDisplayValue("1")).toBeTruthy()
    expect(mockOnChange).toBeCalledTimes(0)

    // Max input
    fireEvent.changeText(getByLabelText("Minimum Label Input"), "#5.55")
    expect(getByDisplayValue("2")).toBeTruthy()
    expect(mockOnChange).toBeCalledTimes(0)

    fireEvent.changeText(getByLabelText("Minimum Label Input"), "5,55")
    expect(getByDisplayValue("2")).toBeTruthy()
    expect(mockOnChange).toBeCalledTimes(0)

    fireEvent.changeText(getByLabelText("Minimum Label Input"), "5#55")
    expect(getByDisplayValue("2")).toBeTruthy()
    expect(mockOnChange).toBeCalledTimes(0)

    fireEvent.changeText(getByLabelText("Minimum Label Input"), "5.55%")
    expect(getByDisplayValue("2")).toBeTruthy()
    expect(mockOnChange).toBeCalledTimes(0)
  })

  it("should call handler when the minimum value is changed", () => {
    const onChangeMock = jest.fn()
    const { getByLabelText } = renderWithWrappersTL(<TestRenderer onChange={onChangeMock} />)

    fireEvent.changeText(getByLabelText("Minimum Label Input"), "5")

    expect(onChangeMock).toBeCalledWith({ min: 5, max: "*" })
  })

  it("should call handler when the maximum value is changed", () => {
    const onChangeMock = jest.fn()
    const { getByLabelText } = renderWithWrappersTL(<TestRenderer onChange={onChangeMock} />)

    fireEvent.changeText(getByLabelText("Maximum Label Input"), "10")

    expect(onChangeMock).toBeCalledWith({ min: "*", max: 10 })
  })

  it("should NOT call `onChange` handler if a non-floating point or non-integer value is entered in the input", () => {
    const onChangeMock = jest.fn()
    const { getByLabelText } = renderWithWrappersTL(<TestRenderer onChange={onChangeMock} />)

    fireEvent.changeText(getByLabelText("Maximum Label Input"), "hello")

    expect(onChangeMock).toBeCalledTimes(0)
  })
})
