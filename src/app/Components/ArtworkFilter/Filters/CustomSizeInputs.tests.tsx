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
    const { getByText, getByA11yLabel } = renderWithWrappersTL(<TestRenderer />)

    expect(getByText("Label")).toBeTruthy()
    expect(getByA11yLabel("Minimum Label Input")).toBeTruthy()
    expect(getByA11yLabel("Maximum Label Input")).toBeTruthy()
  })

  it("should correctly render initial values", () => {
    const { getByDisplayValue } = renderWithWrappersTL(<TestRenderer range={{ min: 5, max: 10 }} />)

    expect(getByDisplayValue("5")).toBeTruthy()
    expect(getByDisplayValue("10")).toBeTruthy()
  })

  it("should call handler when the minimum value is changed", () => {
    const onChangeMock = jest.fn()
    const { getByA11yLabel } = renderWithWrappersTL(<TestRenderer onChange={onChangeMock} />)

    fireEvent.changeText(getByA11yLabel("Minimum Label Input"), "5")

    expect(onChangeMock).toBeCalledWith({ min: 5, max: "*" })
  })

  it("should call handler when the maximum value is changed", () => {
    const onChangeMock = jest.fn()
    const { getByA11yLabel } = renderWithWrappersTL(<TestRenderer onChange={onChangeMock} />)

    fireEvent.changeText(getByA11yLabel("Maximum Label Input"), "10")

    expect(onChangeMock).toBeCalledWith({ min: "*", max: 10 })
  })

  it("should return default value if a non-numeric value is entered in the input", () => {
    const onChangeMock = jest.fn()
    const { getByA11yLabel } = renderWithWrappersTL(<TestRenderer onChange={onChangeMock} />)

    fireEvent.changeText(getByA11yLabel("Maximum Label Input"), "hello")

    expect(onChangeMock).toBeCalledWith({ min: "*", max: "*" })
  })
})
