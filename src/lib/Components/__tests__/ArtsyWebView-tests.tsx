import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import WebView from "react-native-webview"
import { ArtsyWebView } from "../ArtsyWebView"

describe("ArtsyWebView", () => {
  it("Shows react-native-webview", () => {
    const tree = renderWithWrappers(<ArtsyWebView url="random-url" />)

    expect(tree.root.findAllByType(WebView).length).toEqual(1)
  })
})
