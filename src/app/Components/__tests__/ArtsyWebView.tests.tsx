import { fireEvent, screen, waitFor, within } from "@testing-library/react-native"
import {
  ArtsyWebView,
  ArtsyWebViewPage,
  _test_expandGoogleAdLink as expandGoogleAdLink,
  useWebViewCookies,
} from "app/Components/ArtsyWebView"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { dismissModal, goBack, navigate } from "app/system/navigation/navigate"
import { getAppVersion } from "app/utils/appVersion"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import mockFetch from "jest-fetch-mock"
import { debounce } from "lodash"
import { stringify } from "query-string"
import { Platform } from "react-native"
import Share from "react-native-share"
import { WebViewNavigation } from "react-native-webview/lib/WebViewTypes"

const mockCallWebViewEventCallback = jest.fn()
jest.mock("app/utils/useWebViewEvent", () => ({
  useWebViewCallback: () => ({
    callWebViewEventCallback: mockCallWebViewEventCallback,
  }),
}))

// mock implementation of an inner WebView's goBack method that can be observed
const mockGoBack = jest.fn()

// mocked ref to the inner WebView of an ArtsyWebView whose properties can be observed
const mockRef = {
  current: {
    goBack: mockGoBack,
    stopLoading: jest.fn(),
  },
}

// mock implementation of the react-native-webview that allows us to observe its properties
jest.mock("react-native-webview", () => {
  const React = require("react")
  const { View } = require("react-native")

  return {
    __esModule: true,
    default: React.forwardRef((props: any, ref: any) => {
      React.useImperativeHandle(ref, () => mockRef.current)
      return <View ref={ref} testID="webview" {...props} />
    }),
  }
})

jest.mock("lodash/debounce", () => jest.fn())

// render the header icons as host elements so we can tell the close (X) and back buttons apart
jest.mock("@artsy/icons/native", () => {
  const { View } = require("react-native")
  return {
    ...jest.requireActual("@artsy/icons/native"),
    CloseIcon: () => <View testID="close-icon" />,
    ChevronLeftIcon: () => <View testID="chevron-left-icon" />,
  }
})

const mockOnNavigationStateChange: WebViewNavigation = {
  navigationType: "click",
  url: "https://gooooogle.com",
  title: "mock gooooogle",
  loading: true,
  canGoBack: false,
  canGoForward: false,
  lockIdentifier: 70,
}

describe("ArtsyWebView", () => {
  it("shows react-native-webview", async () => {
    await renderWithWrappers(<ArtsyWebView url="random-url" />)
    expect(screen.getAllByTestId("webview")).toHaveLength(1)
  })
})

describe("ArtsyWebViewPage", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(debounce as jest.Mock).mockImplementation((func) => func)
    Platform.OS = "ios"
  })

  const render = (props: Partial<React.ComponentProps<typeof ArtsyWebViewPage>> = {}) =>
    renderWithWrappers(<ArtsyWebViewPage url="https://staging.artsy.net/hello" {...props} />)
  const webViewProps = () => screen.getByTestId("webview").props
  const navigationStateChange = async (navState: Partial<WebViewNavigation>) => {
    await fireEvent(screen.getByTestId("webview"), "navigationStateChange", {
      ...mockOnNavigationStateChange,
      ...navState,
    })
  }

  it("renders a WebView", async () => {
    await render()
    expect((webViewProps().source as any).uri).toEqual("https://staging.artsy.net/hello")
  })

  it(`renders a back button normally`, async () => {
    await render()
    expect(
      within(screen.getByTestId("fancy-modal-header-left-button")).getByTestId("chevron-left-icon")
    ).toBeOnTheScreen()
    expect(screen.queryByTestId("close-icon")).not.toBeOnTheScreen()
  })

  it("renders a close button when presented modally", async () => {
    await render({ isPresentedModally: true })
    expect(
      within(screen.getByTestId("fancy-modal-header-left-button")).getByTestId("close-icon")
    ).toBeOnTheScreen()
    expect(screen.queryByTestId("chevron-left-icon")).not.toBeOnTheScreen()
  })

  it("renders a back button when presented modally and internal navigation has happened", async () => {
    await render({ isPresentedModally: true })

    await navigationStateChange({
      url: "https://staging.artsy.net/meet-the-specialists",
      canGoBack: true,
    })

    expect(screen.queryByTestId("close-icon")).not.toBeOnTheScreen()
    expect(
      within(screen.getByTestId("fancy-modal-header-left-button")).getByTestId("chevron-left-icon")
    ).toBeOnTheScreen()
  })

  it("shares the correct URL", async () => {
    await render({
      showShareButton: true,
      url: "https://staging.artsy.net/meet-the-specialists",
    })

    await fireEvent.press(screen.getByTestId("fancy-modal-header-right-button"))
    expect(Share.open).toHaveBeenLastCalledWith({
      url: "https://staging.artsy.net/meet-the-specialists",
    })

    // Complete the initial load
    await navigationStateChange({
      url: "https://staging.artsy.net/meet-the-specialists",
      loading: false,
    })

    // Navigate to a vanity URL route (shareTitleUrl gets updated for these)
    await navigationStateChange({
      url: "https://staging.artsy.net/some-vanity-url",
    })

    await fireEvent.press(screen.getByTestId("fancy-modal-header-right-button"))
    expect(Share.open).toHaveBeenLastCalledWith({
      url: "https://staging.artsy.net/some-vanity-url",
    })
  })

  it("calls goBack when the close/back button is pressed", async () => {
    await render()
    expect(goBack).not.toHaveBeenCalled()

    await fireEvent.press(screen.getByTestId("fancy-modal-header-left-button"))
    expect(goBack).toHaveBeenCalled()
  })

  it("calls goBack with props when the close/back button is pressed", async () => {
    await render({
      backProps: {
        previousScreen: "BackScreen",
      },
    })
    expect(goBack).not.toHaveBeenCalled()

    await fireEvent.press(screen.getByTestId("fancy-modal-header-left-button"))
    expect(goBack).toHaveBeenCalledWith({
      previousScreen: "BackScreen",
    })
  })

  describe("sets the user agent correctly", () => {
    it("on iOS", async () => {
      ;(LegacyNativeModules.ARNotificationsManager.getConstants as jest.Mock).mockReturnValueOnce({
        userAgent: "Native iOS User Agent",
      })

      await render()
      expect(webViewProps().userAgent).toBe("Native iOS User Agent")
    })

    it("on Android", async () => {
      Platform.OS = "android"
      await render()
      const source = webViewProps().source as any
      expect(source).toHaveProperty("headers")
      expect(source?.headers["User-Agent"]).toBe(
        `Artsy-Mobile android some-system-name/some-system-version Artsy-Mobile/${getAppVersion()} Eigen/some-build-number/${getAppVersion()}`
      )
    })
  })

  describe("with 'light' mode", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ ARDarkModeSupport: true })
      __globalStoreTestUtils__?.injectState({ devicePrefs: { darkModeOption: "off" } })
    })

    it("sets 'x-theme' header correctly", async () => {
      await render()
      const source = webViewProps().source as any

      expect(source?.headers["x-theme"]).toBe("light")
    })
  })

  describe("with 'dark' mode", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ ARDarkModeSupport: true })
      __globalStoreTestUtils__?.injectState({ devicePrefs: { darkModeOption: "on" } })
    })

    it("sets 'x-theme' header correctly", async () => {
      await render()
      const source = webViewProps().source as any

      expect(source?.headers["x-theme"]).toBe("dark")
    })
  })

  it("receives messages from the browser", async () => {
    await render()

    await fireEvent(screen.getByTestId("webview"), "message", {
      nativeEvent: { data: '{"event":"event data"}' },
    })

    expect(mockCallWebViewEventCallback).toHaveBeenCalledWith({ event: "event data" })
  })

  it("doesn't call the event hook given onMessage data in the wrong format", async () => {
    await render()

    await fireEvent(screen.getByTestId("webview"), "message", {
      nativeEvent: { data: "some text" },
    })

    expect(mockCallWebViewEventCallback).not.toHaveBeenCalled()
  })

  describe("mimicBrowserBackButton", () => {
    it("lets our native back button control the browser", async () => {
      const mockSystemBackAction = jest.fn()
      await render({ systemBackAction: mockSystemBackAction })

      await fireEvent.press(screen.getByTestId("fancy-modal-header-left-button"))
      expect(goBack).toHaveBeenCalled()
      ;(goBack as any).mockReset()
      mockSystemBackAction.mockReset()

      // Complete initial load
      await navigationStateChange({
        url: "https://staging.artsy.net/hello",
        loading: false,
        canGoBack: false,
      })

      // Navigate to a ReactWebView route
      await navigationStateChange({
        url: "https://staging.artsy.net/meet-the-specialists",
        canGoBack: true,
      })

      await fireEvent.press(screen.getByTestId("fancy-modal-header-left-button"))
      expect(mockSystemBackAction).toHaveBeenCalled()
      expect(goBack).not.toHaveBeenCalled()
    })

    it("can be overridden", async () => {
      const mockSystemBackAction = jest.fn()
      await render({ mimicBrowserBackButton: false, systemBackAction: mockSystemBackAction })
      await navigationStateChange({
        canGoBack: true,
      })

      await fireEvent.press(screen.getByTestId("fancy-modal-header-left-button"))
      expect(mockSystemBackAction).not.toHaveBeenCalled()
      expect(goBack).toHaveBeenCalled()
    })
  })

  describe("navigation interception", () => {
    it("expands google ad links", async () => {
      await render()
      const googleURL =
        "https://googleads.g.doubleclick.net/pcs/click?" +
        stringify({ adurl: "https://staging.artsy.net/artist/banksy" })
      await navigationStateChange({
        url: googleURL,
      })
      expect(navigate).toHaveBeenCalledWith("https://staging.artsy.net/artist/banksy")
    })

    it("allows inner navigation by default for other webview urls", async () => {
      await render()
      await navigationStateChange({
        url: "https://staging.artsy.net/orders/order-id",
      })
      expect(navigate).not.toHaveBeenCalled()
    })

    it("always calls navigate for external urls", async () => {
      await render()
      await navigationStateChange({
        url: "https://google.com",
      })
      expect(navigate).toHaveBeenCalledWith("https://google.com")
    })

    it("dismisses the modal before navigating to an internal url when the webview is presented modally", async () => {
      await render({ isPresentedModally: true })
      await navigationStateChange({
        url: "https://staging.artsy.net/orders/order-id/details",
      })
      expect(dismissModal).toHaveBeenCalled()
    })

    describe("the inner WebView's goBack method", () => {
      it("is called when the URL matches a route that is not loaded in a web view", async () => {
        await render()
        await navigationStateChange({
          url: "https://staging.artsy.net/artwork/foo",
        })

        expect(mockGoBack).toHaveBeenCalled()
      })

      it("is not called when the URL does not match any route", async () => {
        await render()
        await navigationStateChange({
          url: "https://support.artsy.net/",
        })

        expect(mockGoBack).not.toHaveBeenCalled()
      })

      it("is not called when the URL matches a ModalWebView route on initial load", async () => {
        await render({ url: "https://staging.artsy.net/orders/foo" })
        await navigationStateChange({
          url: "https://staging.artsy.net/orders/foo",
          loading: false,
        })

        // goBack should NOT be called for initial load
        expect(mockGoBack).not.toHaveBeenCalled()
      })

      it("is not called when the URL matches a ReactWebView route", async () => {
        await render()
        await navigationStateChange({
          url: "https://staging.artsy.net/meet-the-specialists",
        })

        expect(mockGoBack).not.toHaveBeenCalled()
      })

      it("is not called when the URL matches a VanityURLEntity route", async () => {
        await render()
        await navigationStateChange({
          url: "https://staging.artsy.net/foo",
        })

        expect(mockGoBack).not.toHaveBeenCalled()
      })
    })
  })
})

describe("useWebViewCookies", () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  const Wrapper = () => {
    useWebViewCookies()
    return null
  }

  it("tries to make an authenticated HEAD request to force and prediction to make sure we get the user's coookies", async () => {
    __globalStoreTestUtils__?.injectState({
      auth: { userAccessToken: "some-token", userID: "some-user" },
    })

    await renderWithWrappers(<Wrapper />)

    expect(mockFetch).toHaveBeenCalledWith("https://staging.artsy.net", {
      method: "HEAD",
      headers: { "X-Access-Token": "some-token" },
    })
    expect(mockFetch).toHaveBeenCalledWith("https://live-staging.artsy.net/login", {
      method: "HEAD",
      headers: { "X-Access-Token": "some-token" },
    })
  })

  it("retries if it fails", async () => {
    __globalStoreTestUtils__?.injectState({
      auth: { userAccessToken: "some-token", userID: "some-user" },
    })

    mockFetch.mockReturnValue(Promise.resolve({ ok: false, status: 500 } as any))

    await renderWithWrappers(<Wrapper />)
    expect(mockFetch).toHaveBeenCalledTimes(2)

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(4), { timeout: 2000 })

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(6), { timeout: 2000 })

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(8), { timeout: 2000 })

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(10), { timeout: 2000 })

    // it stops retrying when it unmounts
    await screen.unmount()

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(10))

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(10))
  })
})

describe("expandGoogleAdLink", () => {
  it("expands google ad links", () => {
    const url =
      "https://googleads.g.doubleclick.net/pcs/click?xai=AKAOjssP2exGGYwg2conYwReIHcnrIYzDoHhZc7tumyovS0nFBxNMhIdz0SOMkZDA4xsyqPmiMMxYSAvlrYVuHdov-fnkhGSj-JRxbZw_1my5t4O5YJ2LrikxJGqhccHeGZg3GOPawefMpc-tBg0dxq9U-nju0-F2FVrsSgx30VxJJma3FtuHvA-60F59c-tvl2FyuZHkBWKPV4kuPBUBZi7A7gHSDBV01fP7TPn8YxjmQpygAMmQzYmQ849ROCaOPd_JRDAP40vcCxvZ-w1Ndoq3HGdUCOBv4LmVhgsxfkm466bibf1mLIXfw&sig=Cg0ArKJSzDr6b2fCnfPy&adurl=https://whitecube.viewingrooms.com/viewing-room/park-seo-bo-white-cube&nm=2&nx=730&ny=-125&mb=2"
    expect(expandGoogleAdLink(url)).toMatchInlineSnapshot(
      `"https://whitecube.viewingrooms.com/viewing-room/park-seo-bo-white-cube"`
    )
  })

  it("expands google ad links with url params", () => {
    const targetURL =
      "https://www.artsy.net/search?" + stringify({ query: "Hello World &hello=world" })
    const googleURL =
      "https://googleads.g.doubleclick.net/pcs/click?" + stringify({ adurl: targetURL })

    const expanded = expandGoogleAdLink(googleURL)
    expect(expanded).toBe(targetURL)
  })

  it("does not touch normal links", () => {
    expect(
      expandGoogleAdLink("https://google.com/search?q=artsy+good+website")
    ).toMatchInlineSnapshot(`"https://google.com/search?q=artsy+good+website"`)
  })

  it("splits links correctly when multiple question marks are present", () => {
    const url =
      "https://googleads.g.doubleclick.net/pcs/click?param1=value1?param2=value2&adurl=https://example.com?foo=bar"
    expect(expandGoogleAdLink(url)).toMatchInlineSnapshot(`"https://example.com?foo=bar"`)
  })
})
