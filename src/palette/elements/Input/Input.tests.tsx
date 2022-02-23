import { fireEvent } from "@testing-library/react-native"
import { renderWithWrappers, renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { Input } from "./Input"

describe("Input", () => {
  const testID = "input"

  it("is rendered", () => {
    const inputComponent = renderWithWrappers(<Input />)

    expect(inputComponent).toBeTruthy()
  })

  it("renders an instance of native TextInput", () => {
    const { getByTestId } = renderWithWrappersTL(<Input testID={testID} />)

    expect(getByTestId(testID).type).toEqual("TextInput")
  })

  it("uses correct font family", () => {
    const { getByTestId } = renderWithWrappersTL(<Input testID={testID} />)

    expect(getByTestId(testID).props.style[0].fontFamily).toEqual("Unica77LL-Regular")
  })

  it("mutates given text as value", () => {
    const { getByTestId } = renderWithWrappersTL(<Input testID={testID} />)

    fireEvent.changeText(getByTestId(testID), "mockStr")

    const value = getByTestId(testID).props.value

    expect(value).toEqual("mockStr")
  })
})
