import { fireEvent } from "@testing-library/react-native"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { Input } from "./Input"

describe("Input", () => {
  const testID = "input"

  it("renders an instance of native TextInput", () => {
    const { getByTestId } = renderWithWrappersTL(<Input testID={testID} />)

    expect(getByTestId(testID).type).toEqual("TextInput")
  })

  it("uses correct font family", () => {
    const { getByTestId } = renderWithWrappersTL(<Input testID={testID} />)

    expect(getByTestId(testID).props.style[0].fontFamily).toEqual("Unica77LL-Regular")
  })

  it("mutates given text as value", () => {
    const { getByTestId, getByDisplayValue } = renderWithWrappersTL(<Input testID={testID} />)

    fireEvent.changeText(getByTestId(testID), "mockStr")

    getByDisplayValue("mockStr")
  })

  it("Shows an error message when input has an error", () => {
    const { getByText } = renderWithWrappersTL(<Input value="" error="input has an error" />)

    getByText("input has an error")
  })

  it("should render the clear button when input is not empty and pressing it should clear the input", () => {
    const {
      getByDisplayValue,
      queryByDisplayValue,
      getByPlaceholderText,
      getByText,
      getByA11yLabel,
    } = renderWithWrappersTL(<Input description="Input" placeholder="USD" enableClearButton />)
    // placeholder is rendered
    getByPlaceholderText("USD")

    // description is rendered
    getByText("Input")

    fireEvent(getByPlaceholderText("USD"), "onChangeText", "Banksy")

    getByDisplayValue("Banksy")

    getByA11yLabel("Clear input button")

    fireEvent.press(getByA11yLabel("Clear input button"))

    expect(queryByDisplayValue("Banksy")).toBeFalsy()
  })

  it("should show the correct show/hide password icon", () => {
    const { getByText, getByPlaceholderText, queryByA11yLabel, getByA11yLabel } =
      renderWithWrappersTL(<Input description="Password" placeholder="password" secureTextEntry />)

    getByText("Password")
    getByPlaceholderText("password")

    getByA11yLabel("show password button")

    fireEvent(getByPlaceholderText("password"), "onChangeText", "123456")

    fireEvent.press(getByA11yLabel("show password button"))

    expect(queryByA11yLabel("show password button")).toBeFalsy()
    getByA11yLabel("hide password button")

    fireEvent.press(getByA11yLabel("hide password button"))

    expect(queryByA11yLabel("hide password button")).toBeFalsy()
    getByA11yLabel("show password button")
  })
})
