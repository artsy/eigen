import mockFetch from "jest-fetch-mock"
import { goBack } from "lib/navigation/navigate"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import WebView from "react-native-webview"
import { act } from "react-test-renderer"
import { __webViewTestUtils__, ArtsyReactWebViewPage, useWebViewCookies } from "../ArtsyReactWebView"
import { FancyModalHeader } from "../FancyModal/FancyModalHeader"

describe(ArtsyReactWebViewPage, () => {
  it(`renders a WebView`, () => {
    const tree = renderWithWrappers(<ArtsyReactWebViewPage url="https://staging.artsy.net/hello" />)
    expect(tree.root.findByType(WebView).props.source.uri).toEqual("https://staging.artsy.net/hello")
  })
  it(`renders a back button normally`, () => {
    const tree = renderWithWrappers(<ArtsyReactWebViewPage url="https://staging.artsy.net/hello" />)
    expect(tree.root.findByType(FancyModalHeader).props.useXButton).toBeFalsy()
    expect(tree.root.findByType(FancyModalHeader).props.onLeftButtonPress).toBeTruthy()
  })
  it(`renders a close button when presented modally`, () => {
    const tree = renderWithWrappers(<ArtsyReactWebViewPage isPresentedModally url="https://staging.artsy.net/hello" />)
    expect(tree.root.findByType(FancyModalHeader).props.useXButton).toBeTruthy()
    expect(tree.root.findByType(FancyModalHeader).props.onLeftButtonPress).toBeTruthy()
  })
  it("calls goBack when the close/back button is pressed", () => {
    const tree = renderWithWrappers(<ArtsyReactWebViewPage url="https://staging.artsy.net/hello" />)
    expect(goBack).not.toHaveBeenCalled()
    tree.root.findByType(FancyModalHeader).props.onLeftButtonPress()
    expect(goBack).toHaveBeenCalled()
  })
  it("has a progress bar that follows page load events", () => {
    const tree = renderWithWrappers(<ArtsyReactWebViewPage url="https://staging.artsy.net/hello" />)
    const getProgressBar = () => tree.root.findByType(__webViewTestUtils__?.ProgressBar!)
    expect(getProgressBar().children).toHaveLength(0)
    act(() => {
      tree.root.findByType(WebView).props.onLoadStart()
    })
    expect(getProgressBar().children).toHaveLength(1)
    act(() => {
      tree.root.findByType(WebView).props.onLoadProgress({ nativeEvent: { progress: 0.5 } })
    })
    expect(getProgressBar().findByProps({ testID: "progress-bar" }).props.style.width).toBe("50%")
    act(() => {
      tree.root.findByType(WebView).props.onLoadEnd()
    })
    expect(getProgressBar().children).toHaveLength(0)
  })
  it("sets the user agent correctly", () => {
    const tree = renderWithWrappers(<ArtsyReactWebViewPage url="https://staging.artsy.net/hello" />)
    expect(tree.root.findByType(WebView).props.userAgent).toBe("Jest Unit Tests")
  })
  it("sets the user agent correctly", () => {
    const tree = renderWithWrappers(<ArtsyReactWebViewPage url="https://staging.artsy.net/hello" />)
    expect(tree.root.findByType(WebView).props.userAgent).toBe("Jest Unit Tests")
  })
})

describe(useWebViewCookies, () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })
  afterAll(() => {
    jest.useRealTimers()
  })
  beforeEach(() => {
    mockFetch.mockClear()
  })
  const Wrapper = () => {
    useWebViewCookies()
    return null
  }
  it("tries to make an authenticated HEAD request to force to make sure we get the user's coookies", () => {
    __globalStoreTestUtils__?.injectState({ auth: { userAccessToken: "userAccessToken" } })
    act(() => {
      renderWithWrappers(<Wrapper />)
    })
    expect(mockFetch).toHaveBeenCalledWith("https://staging.artsy.net", {
      method: "HEAD",
      headers: { "X-Access-Token": "userAccessToken" },
    })
  })
  it("retries if it fails", async () => {
    __globalStoreTestUtils__?.injectState({ auth: { userAccessToken: "userAccessToken" } })
    mockFetch.mockReturnValue(Promise.resolve({ ok: false, status: 500 } as any))
    const tree = renderWithWrappers(<Wrapper />)
    await act(() => undefined)
    expect(mockFetch).toHaveBeenCalledTimes(1)

    jest.runOnlyPendingTimers()
    expect(mockFetch).toHaveBeenCalledTimes(2)

    await act(() => undefined)
    jest.runOnlyPendingTimers()
    expect(mockFetch).toHaveBeenCalledTimes(3)

    await act(() => undefined)
    jest.runOnlyPendingTimers()
    expect(mockFetch).toHaveBeenCalledTimes(4)

    await act(() => undefined)
    jest.runOnlyPendingTimers()
    expect(mockFetch).toHaveBeenCalledTimes(5)

    tree.unmount()

    await act(() => undefined)
    jest.runOnlyPendingTimers()
    expect(mockFetch).toHaveBeenCalledTimes(5)

    await act(() => undefined)
    jest.runOnlyPendingTimers()
    expect(mockFetch).toHaveBeenCalledTimes(5)
  })
})
