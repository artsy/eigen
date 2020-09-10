import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Sans, Spinner } from "palette"
import React from "react"
import { NativeModules } from "react-native"
import WebView from "react-native-webview"
import { RelativeURLWebView } from "../RelativeURLWebView"

describe("RelativeURLWebView", () => {
  it("renders a spinner while loading", () => {
    NativeModules.ARTemporaryAPIModule.resolveRelativeURL = jest
      .fn()
      .mockReturnValue(Promise.resolve("some-resolved-url"))
    const tree = renderWithWrappers(<RelativeURLWebView route={"some-route"} />)
    const spinner = tree.root.findByType(Spinner)
    expect(spinner).toBeDefined()
  })

  it("renders an error message when it cannot resolve the url", async () => {
    const rejectFunc = (error: string) => {
      expect(error).toEqual("some error")
    }

    const resolveURLPromise = new Promise((_, reject) => {
      reject("some error")
    })

    NativeModules.ARTemporaryAPIModule.resolveRelativeURL = jest.fn().mockReturnValue(resolveURLPromise)
    const tree = renderWithWrappers(<RelativeURLWebView route={"some-route"} />)
    await resolveURLPromise.then(null, rejectFunc)
    const sans = tree.root.findByType(Sans)
    expect(sans).toBeDefined()
    expect(extractText(sans)).toEqual("Something went wrong")
  })

  it("renders a webview when it can resolve the url", async () => {
    const resolveFunc = (value: any) => {
      expect(value).toEqual("resolved-url")
    }

    const resolveURLPromise = new Promise((resolve, _) => {
      resolve("resolved-url")
    })

    NativeModules.ARTemporaryAPIModule.resolveRelativeURL = jest.fn().mockReturnValue(resolveURLPromise)
    const tree = renderWithWrappers(<RelativeURLWebView route={"some-route"} />)
    await resolveURLPromise.then(resolveFunc, null)
    const webView = tree.root.findByType(WebView)
    expect(webView).toBeDefined()
  })
})
