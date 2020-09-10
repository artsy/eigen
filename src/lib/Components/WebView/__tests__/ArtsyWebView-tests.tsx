import { __appStoreTestUtils__ } from "lib/store/AppStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import WebView from "react-native-webview"
import { ArtsyWebView } from "../ArtsyWebView"

describe("ArtsyWebView", () => {
  describe("in staging", () => {
    beforeEach(() => {
      __appStoreTestUtils__?.injectState({
        native: { sessionState: { env: "staging" } },
      })
    })

    const expectUpdatedURL = (url: string) => {
      const tree = renderWithWrappers(<ArtsyWebView initialURL={url} />)
      const webview = tree.root.findAllByType(WebView)[0]
      expect(webview.props.source).toEqual({ uri: "https://staging.artsy.net/foo/bar" })
    }

    const expectSameURL = (url: string) => {
      const tree = renderWithWrappers(<ArtsyWebView initialURL={url} />)
      const webview = tree.root.findAllByType(WebView)[0]
      expect(webview.props.source).toEqual({ uri: url })
    }

    it("rewrites the scheme to use https for artsy domains", () => {
      expectUpdatedURL("http://staging.artsy.net/foo/bar")
    })

    it("rewrites the host to use staging for www.artsy.net", () => {
      expectUpdatedURL("http://www.artsy.net/foo/bar")
    })

    it("rewrites the host to use staging for artsy.net", () => {
      expectUpdatedURL("http://artsy.net/foo/bar")
    })

    it("rewrites the host to use staging for m-staging.artsy.net", () => {
      expectUpdatedURL("http://m-staging.artsy.net/foo/bar")
    })

    it("prefixes host to relative urls", () => {
      expectUpdatedURL("/foo/bar")
    })

    it("does not update host or scheme for external artsy urls", () => {
      expectSameURL("https://2013.artsy.net/")
    })

    it("does not update host or scheme for external urls", () => {
      expectSameURL("http://example.com/foo/bar")
    })
  })

  describe("in production", () => {
    beforeEach(() => {
      __appStoreTestUtils__?.injectState({
        native: { sessionState: { env: "production" } },
      })
    })

    const expectUpdatedURL = (url: string) => {
      const tree = renderWithWrappers(<ArtsyWebView initialURL={url} />)
      const webview = tree.root.findAllByType(WebView)[0]
      expect(webview.props.source).toEqual({ uri: "https://www.artsy.net/foo/bar" })
    }

    const expectSameURL = (url: string) => {
      const tree = renderWithWrappers(<ArtsyWebView initialURL={url} />)
      const webview = tree.root.findAllByType(WebView)[0]
      expect(webview.props.source).toEqual({ uri: url })
    }

    it("rewrites the scheme to use https for artsy domains", () => {
      expectUpdatedURL("http://www.artsy.net/foo/bar")
    })

    it("rewrites the host to use production for www.artsy.net", () => {
      expectUpdatedURL("http://www.artsy.net/foo/bar")
    })

    it("rewrites the host to use production for artsy.net", () => {
      expectUpdatedURL("http://artsy.net/foo/bar")
    })

    it("rewrites the host to use production for m.artsy.net", () => {
      expectUpdatedURL("http://m.artsy.net/foo/bar")
    })

    it("prefixes host to relative urls", () => {
      expectUpdatedURL("/foo/bar")
    })

    it("does not update host or scheme for external artsy urls", () => {
      expectSameURL("https://2013.artsy.net/")
    })

    it("does not update host or scheme for external urls", () => {
      expectSameURL("http://example.com/foo/bar")
    })
  })
})
