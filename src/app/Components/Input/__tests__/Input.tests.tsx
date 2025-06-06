import { fireEvent } from "@testing-library/react-native"
import { Input } from "app/Components/Input/Input"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("Input", () => {
  const testID = "input"

  it("renders an instance of native TextInput", () => {
    const { getByTestId } = renderWithWrappers(<Input testID={testID} />)

    expect(getByTestId(testID).type).toEqual("TextInput")
  })

  it("uses correct font family", () => {
    const { getByTestId } = renderWithWrappers(<Input testID={testID} />)

    expect(getByTestId(testID).props.style[0].fontFamily).toEqual("Unica77LL-Regular")
  })

  it("mutates given text as value", () => {
    const { getByTestId, getByDisplayValue } = renderWithWrappers(<Input testID={testID} />)

    fireEvent.changeText(getByTestId(testID), "mockStr")

    getByDisplayValue("mockStr")
  })

  it("Shows an error message when input has an error", () => {
    const { getByText } = renderWithWrappers(<Input value="" error="input has an error" />)

    getByText("input has an error")
  })

  it("should render the clear button when input is not empty and pressing it should clear the input", () => {
    const {
      getByDisplayValue,
      queryByDisplayValue,
      getByPlaceholderText,
      getByText,
      getByLabelText,
    } = renderWithWrappers(<Input description="Input" placeholder="USD" enableClearButton />)
    // placeholder is rendered
    getByPlaceholderText("USD")

    // description is rendered
    getByText("Input")

    fireEvent(getByPlaceholderText("USD"), "onChangeText", "Banksy")

    getByDisplayValue("Banksy")

    getByLabelText("Clear input button")

    fireEvent.press(getByLabelText("Clear input button"))

    expect(queryByDisplayValue("Banksy")).toBeFalsy()
  })

  it("should show the correct show/hide password icon", () => {
    const { getByText, getByPlaceholderText, queryByLabelText, getByLabelText } =
      renderWithWrappers(<Input description="Password" placeholder="password" secureTextEntry />)

    getByText("Password")
    getByPlaceholderText("password")

    getByLabelText("show password button")

    fireEvent(getByPlaceholderText("password"), "onChangeText", "123456")

    fireEvent.press(getByLabelText("show password button"))

    expect(queryByLabelText("show password button")).toBeFalsy()
    getByLabelText("hide password button")

    fireEvent.press(getByLabelText("hide password button"))

    expect(queryByLabelText("hide password button")).toBeFalsy()
    getByLabelText("show password button")
  })
})
