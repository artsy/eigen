import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import WebView from "react-native-webview"
import { ArtsyWebView } from "./ArtsyWebView"

describe("ArtsyWebView", () => {
  it("shows react-native-webview", () => {
    const tree = renderWithWrappers(<ArtsyWebView url="random-url" />)
    expect(tree.root.findAllByType(WebView).length).toEqual(1)
  })
})
