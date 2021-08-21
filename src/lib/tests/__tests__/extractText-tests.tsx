import React from "react"
import { Text as RNText } from "react-native"
import { extractText } from "../extractText"
import { renderWithWrappersTL } from "../renderWithWrappers"

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
})
