import { waitFor } from "@testing-library/react-native"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { goBack, navigate } from "app/navigation/navigate"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { appJson } from "app/utils/jsonFiles"
import mockFetch from "jest-fetch-mock"
import { stringify } from "query-string"
import React from "react"
import Share from "react-native-share"
import WebView, { WebViewProps } from "react-native-webview"
import { act } from "react-test-renderer"
import { __webViewTestUtils__, ArtsyReactWebViewPage, useWebViewCookies } from "./ArtsyReactWebView"

jest.mock("react-native-device-info", () => ({
  getBuildNumber: () => "build-number",
  getVersion: jest.fn(),
  getModel: jest.fn(),
  getUserAgentSync: jest.fn(),
  getDeviceType: jest.fn(),
  hasNotch: jest.fn(),
}))

describe(ArtsyReactWebViewPage, () => {
  const render = (props: Partial<React.ComponentProps<typeof ArtsyReactWebViewPage>> = {}) =>
    renderWithWrappers(<ArtsyReactWebViewPage url="https://staging.artsy.net/hello" {...props} />)
  const webViewProps = (tree: ReturnType<typeof render>) =>
    tree.root.findByType(WebView).props as WebViewProps
  it(`renders a WebView`, () => {
    const tree = render()
    expect((webViewProps(tree).source as any).uri).toEqual("https://staging.artsy.net/hello")
  })
  it(`renders a back button normally`, () => {
    const tree = render()
    expect(tree.root.findByType(FancyModalHeader).props.useXButton).toBeFalsy()
    expect(tree.root.findByType(FancyModalHeader).props.onLeftButtonPress).toBeTruthy()
  })
  it(`renders a close button when presented modally`, () => {
    const tree = render({ isPresentedModally: true })
    expect(tree.root.findByType(FancyModalHeader).props.useXButton).toBeTruthy()
    expect(tree.root.findByType(FancyModalHeader).props.onLeftButtonPress).toBeTruthy()
  })
  it(`renders a back button when presented modally and internal navigation is has happened`, () => {
    const tree = render({ isPresentedModally: true })
    act(() => {
      webViewProps(tree).onNavigationStateChange?.({ canGoBack: true } as any)
    })
    expect(tree.root.findByType(FancyModalHeader).props.useXButton).toBeFalsy()
  })
  it("shares the correct URL", () => {
    const tree = render({ showShareButton: true })
    tree.root.findByType(FancyModalHeader).props.onRightButtonPress()
    waitFor(() => expect(jest.fn()).toHaveBeenCalledTimes(1))
    expect(Share.open).toHaveBeenCalledWith({ url: "https://staging.artsy.net/hello" })
  })
  it("calls goBack when the close/back button is pressed", () => {
    const tree = render()
    expect(goBack).not.toHaveBeenCalled()
    tree.root.findByType(FancyModalHeader).props.onLeftButtonPress()
    expect(goBack).toHaveBeenCalled()
  })
  it("calls goBack with props when the close/back button is pressed", () => {
    const tree = render({
      backProps: {
        previousScreen: "BackScreen",
      },
    })

    expect(goBack).not.toHaveBeenCalled()
    tree.root.findByType(FancyModalHeader).props.onLeftButtonPress()
    expect(goBack).toHaveBeenCalledWith({
      previousScreen: "BackScreen",
    })
  })
  it("has a progress bar that follows page load events", () => {
    const tree = render()
    const getProgressBar = () => tree.root.findByType(__webViewTestUtils__?.ProgressBar!)
    expect(getProgressBar().children).toHaveLength(0)
    act(() => tree.root.findByType(WebView).props.onLoadStart())
    expect(getProgressBar().children).toHaveLength(1)
    act(() =>
      tree.root.findByType(WebView).props.onLoadProgress({ nativeEvent: { progress: 0.5 } })
    )
    expect(getProgressBar().findByProps({ testID: "progress-bar" }).props.width).toBe("50%")
    act(() => tree.root.findByType(WebView).props.onLoadEnd())
    expect(getProgressBar().children).toHaveLength(0)
  })
  it("sets the user agent correctly", () => {
    const tree = render()
    expect(tree.root.findByType(WebView).props.userAgent).toBe(
      `Artsy-Mobile ios Artsy-Mobile/${appJson().version} Eigen/build-number/${appJson().version}`
    )
  })
  it("sets the user agent correctly", () => {
    const tree = render()
    expect(tree.root.findByType(WebView).props.userAgent).toBe(
      `Artsy-Mobile ios Artsy-Mobile/${appJson().version} Eigen/build-number/${appJson().version}`
    )
  })

  describe("mimicBrowserBackButton", () => {
    it("lets our native back button control the browser", () => {
      const tree = render()
      const browserGoBack = jest
        .spyOn(tree.root.findByType(WebView).instance, "goBack")
        .mockImplementation(() => undefined)

      tree.root.findByType(FancyModalHeader).props.onLeftButtonPress()
      expect(goBack).toHaveBeenCalled()
      expect(browserGoBack).not.toHaveBeenCalled()
      ;(goBack as any).mockReset()
      ;(browserGoBack as any).mockReset()

      webViewProps(tree).onNavigationStateChange?.({ canGoBack: true } as any)

      tree.root.findByType(FancyModalHeader).props.onLeftButtonPress()
      expect(browserGoBack).toHaveBeenCalled()
      expect(goBack).not.toHaveBeenCalled()
    })

    it("can be overridden", () => {
      const tree = render({ mimicBrowserBackButton: false })
      const browserGoBack = jest
        .spyOn(tree.root.findByType(WebView).instance, "goBack")
        .mockImplementation(() => undefined)

      webViewProps(tree).onNavigationStateChange?.({ canGoBack: true } as any)

      tree.root.findByType(FancyModalHeader).props.onLeftButtonPress()
      expect(browserGoBack).not.toHaveBeenCalled()
      expect(goBack).toHaveBeenCalled()
    })
  })

  describe("navigation interception", () => {
    it("ignores requests that are not on the top frame", () => {
      const tree = render()
      // `topFrame: false` should return true (true means 'web view should load this URL')
      expect(
        webViewProps(tree).onShouldStartLoadWithRequest?.({
          isTopFrame: false,
          url: "https://staging.artsy.net/artist/banksy",
        } as any)
      ).toBe(true)
      // `topFrame: true` should return false for urls we can handle in the app (false means 'web view should not load this URL')
      expect(
        webViewProps(tree).onShouldStartLoadWithRequest?.({
          isTopFrame: true,
          url: "https://staging.artsy.net/artist/banksy",
        } as any)
      ).toBe(false)
    })
    it("expands google ad links", () => {
      const tree = render()
      const googleURL =
        "https://googleads.g.doubleclick.net/pcs/click?" +
        stringify({ adurl: "https://staging.artsy.net/artist/banksy" })
      webViewProps(tree).onShouldStartLoadWithRequest?.({ url: googleURL, isTopFrame: true } as any)
      expect(navigate).toHaveBeenCalledWith("https://staging.artsy.net/artist/banksy")
    })
    it("allows inner navigation by default for other web view urls", () => {
      const tree = render()
      const result = webViewProps(tree).onShouldStartLoadWithRequest?.({
        url: "https://staging.artsy.net/orders/order-id",
        isTopFrame: true,
      } as any)
      expect(navigate).not.toHaveBeenCalled()
      expect(result).toBe(true)
    })
    it("always calls navigate for external urls", () => {
      const tree = render()
      const result = webViewProps(tree).onShouldStartLoadWithRequest?.({
        url: "https://google.com",
        isTopFrame: true,
      } as any)
      expect(navigate).toHaveBeenCalledWith("https://google.com")
      expect(result).toBe(false)
    })
    it("always calls navigate when allowWebViewInnerNavigation is false", () => {
      const tree = render({ allowWebViewInnerNavigation: false })
      const result = webViewProps(tree).onShouldStartLoadWithRequest?.({
        url: "https://staging.artsy.net/orders/order-id",
        isTopFrame: true,
      } as any)
      expect(result).toBe(false)
    })
  })
})

describe(useWebViewCookies, () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })
  const Wrapper = () => {
    useWebViewCookies()
    return null
  }
  it("tries to make an authenticated HEAD request to force and prediction to make sure we get the user's coookies", () => {
    __globalStoreTestUtils__?.injectState({
      native: { sessionState: { authenticationToken: "userAccessToken" } },
    })
    act(() => {
      renderWithWrappers(<Wrapper />)
    })
    waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("https://staging.artsy.net", {
        method: "HEAD",
        headers: { "X-Access-Token": "userAccessToken" },
      })
      expect(mockFetch).toHaveBeenCalledWith("https://live-staging.artsy.net/login", {
        method: "HEAD",
        headers: { "X-Access-Token": "userAccessToken" },
      })
    })
  })
  it("retries if it fails", async () => {
    __globalStoreTestUtils__?.injectState({
      native: { sessionState: { authenticationToken: "userAccessToken" } },
    })
    mockFetch.mockReturnValue(Promise.resolve({ ok: false, status: 500 } as any))
    const tree = renderWithWrappers(<Wrapper />)
    await act(() => undefined)
    waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2))

    waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(4))

    await act(() => undefined)
    waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(6))

    await act(() => undefined)
    waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(8))

    await act(() => undefined)
    waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(10))

    tree.unmount()

    await act(() => undefined)
    waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(10))

    await act(() => undefined)
    waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(10))
  })
})

describe(__webViewTestUtils__?.expandGoogleAdLink!, () => {
  it("expands google ad links", () => {
    const url =
      "https://googleads.g.doubleclick.net/pcs/click?xai=AKAOjssP2exGGYwg2conYwReIHcnrIYzDoHhZc7tumyovS0nFBxNMhIdz0SOMkZDA4xsyqPmiMMxYSAvlrYVuHdov-fnkhGSj-JRxbZw_1my5t4O5YJ2LrikxJGqhccHeGZg3GOPawefMpc-tBg0dxq9U-nju0-F2FVrsSgx30VxJJma3FtuHvA-60F59c-tvl2FyuZHkBWKPV4kuPBUBZi7A7gHSDBV01fP7TPn8YxjmQpygAMmQzYmQ849ROCaOPd_JRDAP40vcCxvZ-w1Ndoq3HGdUCOBv4LmVhgsxfkm466bibf1mLIXfw&sig=Cg0ArKJSzDr6b2fCnfPy&adurl=https://whitecube.viewingrooms.com/viewing-room/park-seo-bo-white-cube&nm=2&nx=730&ny=-125&mb=2"
    expect(__webViewTestUtils__?.expandGoogleAdLink(url)).toMatchInlineSnapshot(
      `"https://whitecube.viewingrooms.com/viewing-room/park-seo-bo-white-cube"`
    )
  })

  it("expands google ad links with url params", () => {
    const targetURL =
      "https://www.artsy.net/search?" + stringify({ query: "Hello World &hello=world" })
    const googleURL =
      "https://googleads.g.doubleclick.net/pcs/click?" + stringify({ adurl: targetURL })

    const expanded = __webViewTestUtils__?.expandGoogleAdLink(googleURL)
    expect(expanded).toBe(targetURL)
  })

  it("does not touch normal links", () => {
    expect(
      __webViewTestUtils__?.expandGoogleAdLink("https://google.com/search?q=artsy+good+website")
    ).toMatchInlineSnapshot(`"https://google.com/search?q=artsy+good+website"`)
  })
})
