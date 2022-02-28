import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import WebView from "react-native-webview"
import { ArtsyWebView } from "./ArtsyWebView"
import InternalWebView from "./InternalWebView"

describe("ArtsyWebView", () => {
  it("Shows react-native-webview if the AROptionsUseReactNativeWebView is set to true", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AROptionsUseReactNativeWebView: true })
    const tree = renderWithWrappers(<ArtsyWebView url="random-url" />)

    expect(tree.root.findAllByType(WebView).length).toEqual(1)
    expect(tree.root.findAllByType(InternalWebView).length).toEqual(0)
  })

  it("Shows InternalWebView the AROptionsUseReactNativeWebView is set to false", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AROptionsUseReactNativeWebView: false })
    const tree = renderWithWrappers(<ArtsyWebView url="random-url" />)

    expect(tree.root.findAllByType(InternalWebView).length).toEqual(1)
    expect(tree.root.findAllByType(WebView).length).toEqual(0)
  })
})
