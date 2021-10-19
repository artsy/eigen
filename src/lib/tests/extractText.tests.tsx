import React from "react"
import { Text as RNText, TextInput as RNTextInput } from "react-native"
import { extractText } from "./extractText"
import { renderWithWrappersTL } from "./renderWithWrappers"

describe("extractText", () => {
  it("works for a string", () => {
    expect(extractText("indeed")).toEqual("indeed")
  })

  it("works for the simple case", () => {
    const { container } = renderWithWrappersTL(<RNText>wow</RNText>)
    expect(extractText(container)).toEqual("wow")
  })

  it("works for nested Texts", () => {
    const { container } = renderWithWrappersTL(
      <RNText>
        wow
        <RNText>such</RNText>
        nest
      </RNText>
    )
    expect(extractText(container)).toEqual("wowsuchnest")
  })

  it("works for Inputs", () => {
    const { container } = renderWithWrappersTL(<RNTextInput value="wow" />)
    expect(extractText(container)).toEqual("wow")
  })
})
