import { screen } from "@testing-library/react-native"
import { Text as RNText, TextInput as RNTextInput } from "react-native"
import { ReactTestInstance } from "react-test-renderer"
import { extractText } from "./extractText"
import { renderWithWrappers } from "./renderWithWrappers"

describe("extractText", () => {
  it("works for a string", () => {
    expect(extractText("indeed")).toEqual("indeed")
  })

  it("works for the simple case", () => {
    renderWithWrappers(<RNText>wow</RNText>)

    const container = screen.toJSON() as ReactTestInstance

    expect(extractText(container)).toEqual("wow")
  })

  it("works for nested Texts", () => {
    renderWithWrappers(
      <RNText>
        wow
        <RNText>such</RNText>
        nest
      </RNText>
    )

    const container = screen.toJSON() as ReactTestInstance

    expect(extractText(container)).toEqual("wowsuchnest")
  })

  it("works for Inputs", () => {
    const { UNSAFE_root } = renderWithWrappers(<RNTextInput value="wow" />)

    expect(extractText(UNSAFE_root)).toEqual("wow")
  })
})
