import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import WebView from "react-native-webview"
import { SaleFAQ } from "./SaleFAQ"

describe("SaleFAQ", () => {
  it("returns a webview", () => {
    const tree = renderWithWrappers(<SaleFAQ />)

    expect(tree.root.findAllByType(WebView).length).toEqual(1)
  })
})
