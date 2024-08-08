import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { goBack, navigate } from "app/system/navigation/navigate"
import { appJson } from "app/utils/jsonFiles"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import mockFetch from "jest-fetch-mock"
import { debounce } from "lodash"
import { stringify } from "query-string"
import { Platform } from "react-native"
import Share from "react-native-share"
import WebView, { WebViewProps } from "react-native-webview"
import { WebViewNavigation } from "react-native-webview/lib/WebViewTypes"

import {
  _test_expandGoogleAdLink as expandGoogleAdLink,
  ArtsyWebView,
  ArtsyWebViewPage,
  useWebViewCookies,
} from "./ArtsyWebView"

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
      return <View ref={ref} {...props} />
    }),
  }
})

jest.mock("lodash/debounce", () => jest.fn())

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
  it("shows react-native-webview", () => {
    renderWithWrappers(<ArtsyWebView url="random-url" />)
    expect(screen.UNSAFE_getAllByType(WebView)).toHaveLength(1)
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
  const webViewProps = (tree: ReturnType<typeof render>) =>
    tree.UNSAFE_getByType(WebView).props as WebViewProps

  it("renders a WebView", () => {
    const tree = render()
    expect((webViewProps(tree).source as any).uri).toEqual("https://staging.artsy.net/hello")
  })

  it(`renders a back button normally`, () => {
    render()
    expect(screen.UNSAFE_getByType(FancyModalHeader).props.useXButton).toBeFalse()
    expect(screen.UNSAFE_getByType(FancyModalHeader).props.onLeftButtonPress).not.toBeUndefined()
  })

  it("renders a close button when presented modally", () => {
    render({ isPresentedModally: true })
    expect(screen.UNSAFE_getByType(FancyModalHeader).props.useXButton).toBeTrue()
    expect(screen.UNSAFE_getByType(FancyModalHeader).props.onLeftButtonPress).not.toBeUndefined()
  })

  it("renders a back button when presented modally and internal navigation is has happened", () => {
    const tree = render({ isPresentedModally: true })
    webViewProps(tree).onNavigationStateChange?.({
      ...mockOnNavigationStateChange,
      canGoBack: true,
    })
    expect(screen.UNSAFE_getByType(FancyModalHeader).props.useXButton).toBeFalsy()
  })

  it("shares the correct URL", () => {
    const tree = render({
      showShareButton: true,
      url: "https://staging.artsy.net/non-native/this-doesnt-have-a-native-view-1",
    })

    fireEvent.press(screen.getByTestId("fancy-modal-header-right-button"))
    expect(Share.open).toHaveBeenLastCalledWith({
      url: "https://staging.artsy.net/non-native/this-doesnt-have-a-native-view-1",
    })

    webViewProps(tree).onNavigationStateChange?.({
      ...mockOnNavigationStateChange,
      url: "https://staging.artsy.net/non-native/this-doesnt-have-a-native-view-2",
    })

    fireEvent.press(screen.getByTestId("fancy-modal-header-right-button"))
    expect(Share.open).toHaveBeenLastCalledWith({
      url: "https://staging.artsy.net/non-native/this-doesnt-have-a-native-view-2",
    })
  })

  it("calls goBack when the close/back button is pressed", () => {
    render()
    expect(goBack).not.toHaveBeenCalled()

    fireEvent.press(screen.getByTestId("fancy-modal-header-left-button"))
    expect(goBack).toHaveBeenCalled()
  })

  it("calls goBack with props when the close/back button is pressed", () => {
    render({
      backProps: {
        previousScreen: "BackScreen",
      },
    })
    expect(goBack).not.toHaveBeenCalled()

    fireEvent.press(screen.getByTestId("fancy-modal-header-left-button"))
    expect(goBack).toHaveBeenCalledWith({
      previousScreen: "BackScreen",
    })
  })

  describe("sets the user agent correctly", () => {
    it("on iOS", () => {
      const tree = render()
      expect(webViewProps(tree).userAgent).toBe(
        `Artsy-Mobile ios Artsy-Mobile/${appJson().version} Eigen/some-build-number/${
          appJson().version
        }`
      )
    })

    it("on Android", () => {
      Platform.OS = "android"
      const tree = render()
      const source = webViewProps(tree).source
      expect(source).toHaveProperty("headers")
      expect(source?.headers["User-Agent"]).toBe(
        `Artsy-Mobile android Artsy-Mobile/${appJson().version} Eigen/some-build-number/${
          appJson().version
        }`
      )
    })
  })

  it("receives messages from the browser", () => {
    const tree = render()
    webViewProps(tree).onMessage?.({ nativeEvent: { data: '{"event":"event data"}' } } as any)
    expect(mockCallWebViewEventCallback).toHaveBeenCalledWith({ event: "event data" })
  })

  it("doesn't call the event hook given onMessage data in the wrong format", () => {
    const tree = render()
    webViewProps(tree).onMessage?.({ nativeEvent: { data: "some text" } } as any)
    expect(mockCallWebViewEventCallback).not.toHaveBeenCalled()
  })

  describe("mimicBrowserBackButton", () => {
    it("lets our native back button control the browser", () => {
      const mockSystemBackAction = jest.fn()
      const tree = render({ systemBackAction: mockSystemBackAction })

      fireEvent.press(screen.getByTestId("fancy-modal-header-left-button"))
      expect(goBack).toHaveBeenCalled()
      ;(goBack as any).mockReset()
      mockSystemBackAction.mockReset()

      webViewProps(tree).onNavigationStateChange?.({
        ...mockOnNavigationStateChange,
        canGoBack: true,
      })

      fireEvent.press(screen.getByTestId("fancy-modal-header-left-button"))
      expect(mockSystemBackAction).toHaveBeenCalled()
      expect(goBack).not.toHaveBeenCalled()
    })

    it("can be overridden", () => {
      const mockSystemBackAction = jest.fn()
      const tree = render({ mimicBrowserBackButton: false, systemBackAction: mockSystemBackAction })

      webViewProps(tree).onNavigationStateChange?.({
        ...mockOnNavigationStateChange,
        canGoBack: true,
      })

      fireEvent.press(screen.getByTestId("fancy-modal-header-left-button"))
      expect(mockSystemBackAction).not.toHaveBeenCalled()
      expect(goBack).toHaveBeenCalled()
    })
  })

  describe("navigation interception", () => {
    it("expands google ad links", () => {
      const tree = render()
      const googleURL =
        "https://googleads.g.doubleclick.net/pcs/click?" +
        stringify({ adurl: "https://staging.artsy.net/artist/banksy" })

      webViewProps(tree).onNavigationStateChange?.({
        ...mockOnNavigationStateChange,
        url: googleURL,
      })
      expect(navigate).toHaveBeenCalledWith("https://staging.artsy.net/artist/banksy")
    })

    it("allows inner navigation by default for other webview urls", () => {
      const tree = render()
      webViewProps(tree).onNavigationStateChange?.({
        ...mockOnNavigationStateChange,
        url: "https://staging.artsy.net/orders/order-id",
      })
      expect(navigate).not.toHaveBeenCalled()
    })

    it("always calls navigate for external urls", () => {
      const tree = render()
      webViewProps(tree).onNavigationStateChange?.({
        ...mockOnNavigationStateChange,
        url: "https://google.com",
      })
      expect(navigate).toHaveBeenCalledWith("https://google.com")
    })

    describe("the inner WebView's goBack method", () => {
      it("is called when the URL matches a route that is not loaded in a web view", () => {
        const tree = render()

        webViewProps(tree).onNavigationStateChange?.({
          ...mockOnNavigationStateChange,
          url: "https://staging.artsy.net/artwork/foo",
        })

        expect(mockGoBack).toHaveBeenCalled()
      })

      it("is not called when the URL does not match any route", () => {
        const tree = render()

        webViewProps(tree).onNavigationStateChange?.({
          ...mockOnNavigationStateChange,
          url: "https://support.artsy.net/",
        })

        expect(mockGoBack).not.toHaveBeenCalled()
      })

      it("is not called when the URL matches a ModalWebView route", () => {
        const tree = render()

        webViewProps(tree).onNavigationStateChange?.({
          ...mockOnNavigationStateChange,
          url: "https://staging.artsy.net/orders/foo",
        })

        expect(mockGoBack).not.toHaveBeenCalled()
      })

      it("is not called when the URL matches a ReactWebView route", () => {
        const tree = render()

        webViewProps(tree).onNavigationStateChange?.({
          ...mockOnNavigationStateChange,
          url: "https://staging.artsy.net/meet-the-specialists",
        })

        expect(mockGoBack).not.toHaveBeenCalled()
      })

      it("is not called when the URL matches a VanityURLEntity route", () => {
        const tree = render()

        webViewProps(tree).onNavigationStateChange?.({
          ...mockOnNavigationStateChange,
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

  it("tries to make an authenticated HEAD request to force and prediction to make sure we get the user's coookies", () => {
    __globalStoreTestUtils__?.injectState({
      auth: { userAccessToken: "some-token", userID: "some-user" },
    })

    renderWithWrappers(<Wrapper />)

    expect(mockFetch).toHaveBeenCalledWith("https://staging.artsy.net", {
      method: "HEAD",
      headers: { "X-Access-Token": "some-token" },
    })
    expect(mockFetch).toHaveBeenCalledWith("https://live-staging.artsy.net/login", {
      method: "HEAD",
      headers: { "X-Access-Token": "some-token" },
    })
  })

  it("retries if it fails", () => {
    __globalStoreTestUtils__?.injectState({
      auth: { userAccessToken: "some-token", userID: "some-user" },
    })

    mockFetch.mockReturnValue(Promise.resolve({ ok: false, status: 500 } as any))

    renderWithWrappers(<Wrapper />)
    expect(mockFetch).toHaveBeenCalledTimes(2)

    waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(4))

    waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(6))

    waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(8))

    waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(10))

    // it stops retrying when it unmounts
    screen.unmount()

    waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(10))

    waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(10))
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
})
