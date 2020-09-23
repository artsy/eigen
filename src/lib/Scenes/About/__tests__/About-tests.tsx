import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Linking } from "react-native"
// import { Linking, Text } from "react-native"
import { About, PRIVACY_POLICY_URL, TERMS_OF_USE_URL } from "../About"

describe("About", () => {
  it("renders Terms and conditions", () => {
    const tree = renderWithWrappers(<About />)

    expect(tree.root.findAllByProps({ title: "Terms of use" })).toBeTruthy()
    tree.root.findByProps({ title: "Terms of use" }).props.onPress()
    expect(Linking.openURL).toHaveBeenCalledWith(TERMS_OF_USE_URL)
  })

  it("renders Privacy policy", () => {
    const tree = renderWithWrappers(<About />)

    expect(tree.root.findAllByProps({ title: "Privacy policy" })).toBeTruthy()
    tree.root.findByProps({ title: "Terms of use" }).props.onPress()
    expect(Linking.openURL).toHaveBeenCalledWith(PRIVACY_POLICY_URL)
  })

  it("renders Version", () => {
    const tree = renderWithWrappers(<About />)

    expect(tree.root.findAllByProps({ title: "Version" })).toBeTruthy()
  })
})
