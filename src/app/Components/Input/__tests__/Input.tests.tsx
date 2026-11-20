import { fireEvent, screen } from "@testing-library/react-native"
import { Input } from "app/Components/Input/Input"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("Input", () => {
  const testID = "input"

  it("renders an instance of native TextInput", async () => {
    await renderWithWrappers(<Input testID={testID} />)

    expect(screen.getByTestId(testID).type).toEqual("TextInput")
  })

  it("uses correct font family", async () => {
    await renderWithWrappers(<Input testID={testID} />)

    expect(screen.getByTestId(testID).props.style[0].fontFamily).toEqual("Unica77LL-Regular")
  })

  it("mutates given text as value", async () => {
    await renderWithWrappers(<Input testID={testID} />)

    await fireEvent.changeText(screen.getByTestId(testID), "mockStr")

    screen.getByDisplayValue("mockStr")
  })

  it("Shows an error message when input has an error", async () => {
    await renderWithWrappers(<Input value="" error="input has an error" />)

    screen.getByText("input has an error")
  })

  it("should render the clear button when input is not empty and pressing it should clear the input", async () => {
    await renderWithWrappers(<Input description="Input" placeholder="USD" enableClearButton />)
    // placeholder is rendered
    screen.getByPlaceholderText("USD")

    // description is rendered
    screen.getByText("Input")

    await fireEvent(screen.getByPlaceholderText("USD"), "onChangeText", "Banksy")

    screen.getByDisplayValue("Banksy")

    screen.getByLabelText("Clear input button")

    await fireEvent.press(screen.getByLabelText("Clear input button"))

    expect(screen.queryByDisplayValue("Banksy")).toBeFalsy()
  })

  it("should show the correct show/hide password icon", async () => {
    await renderWithWrappers(
      <Input description="Password" placeholder="password" secureTextEntry />
    )

    screen.getByText("Password")
    screen.getByPlaceholderText("password")

    screen.getByLabelText("show password button")

    await fireEvent(screen.getByPlaceholderText("password"), "onChangeText", "123456")

    await fireEvent.press(screen.getByLabelText("show password button"))

    expect(screen.queryByLabelText("show password button")).toBeFalsy()
    screen.getByLabelText("hide password button")

    await fireEvent.press(screen.getByLabelText("hide password button"))

    expect(screen.queryByLabelText("hide password button")).toBeFalsy()
    screen.getByLabelText("show password button")
  })
})
