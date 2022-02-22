import { ArtsyWebView } from "app/Components/ArtsyWebView"
import { navigate } from "app/navigation/navigate"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { extractText } from "app/tests/extractText"
import { fetchMockResponseOnce } from "app/tests/fetchMockHelpers"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import fetchMock from "jest-fetch-mock"
import { Button, Spinner } from "palette"
import React from "react"
import { Linking } from "react-native"
import { VanityURLPossibleRedirect } from "./VanityURLPossibleRedirect"

beforeEach(() => {
  __globalStoreTestUtils__?.setProductionMode()
  __globalStoreTestUtils__?.injectState({ auth: { userAccessToken: "authenticationToken" } })
  fetchMock.resetMocks()
})

describe(VanityURLPossibleRedirect, () => {
  it("shows a loading spinner before anything has happened", async () => {
    fetchMockResponseOnce({
      status: 200,
      url: "https://artsy.net/test",
    })
    const tree = renderWithWrappers(<VanityURLPossibleRedirect slug="test" />)
    expect(tree.root.findAllByType(Spinner)).toHaveLength(1)
    await flushPromiseQueue()
  })

  it("sends a fetch request", async () => {
    fetchMockResponseOnce({
      status: 200,
      url: "https://www.artsy.net/test",
    })
    renderWithWrappers(<VanityURLPossibleRedirect slug="test" />)
    await flushPromiseQueue()
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "https://www.artsy.net/test",
        Object {
          "headers": Object {
            "X-Access-Token": "authenticationToken",
          },
          "method": "HEAD",
        },
      ]
    `)
  })

  it("calls `navigate` when the redirect points to an external url", async () => {
    fetchMockResponseOnce({
      status: 200,
      url: "https://google.com/blah",
    })

    renderWithWrappers(<VanityURLPossibleRedirect slug="test" />)
    await flushPromiseQueue()
    expect(navigate).toHaveBeenCalledWith("https://google.com/blah")
  })

  it("calls `navigate` when the redirect points to a native view", async () => {
    fetchMockResponseOnce({
      status: 200,
      url: "https://www.artsy.net/artist/banksy",
    })
    renderWithWrappers(<VanityURLPossibleRedirect slug="test" />)
    await flushPromiseQueue()
    expect(navigate).toHaveBeenCalledWith("https://www.artsy.net/artist/banksy")
  })

  describe("the error page", () => {
    const openURLMock = jest.fn()
    const originalOpenURL = Linking.openURL
    beforeAll(() => {
      Linking.openURL = openURLMock
    })
    afterAll(() => {
      Linking.openURL = originalOpenURL
    })
    beforeEach(() => {
      openURLMock.mockReset()
    })

    it("shows the error page if the fetch fails", async () => {
      fetchMock.mockRejectOnce()
      const tree = renderWithWrappers(<VanityURLPossibleRedirect slug="test-fail" />)
      await flushPromiseQueue()
      expect(extractText(tree.root)).toContain("We can't find that page")
      expect(openURLMock).not.toHaveBeenCalled()
      tree.root.findByType(Button).props.onPress()
      expect(openURLMock).toHaveBeenCalledWith("https://www.artsy.net/test-fail")
    })

    it("shows the error page if the response is not `ok`", async () => {
      fetchMockResponseOnce({
        status: 404,
        url: "https://whatever",
      })
      const tree = renderWithWrappers(<VanityURLPossibleRedirect slug="test-not-ok" />)
      await flushPromiseQueue()
      expect(extractText(tree.root)).toContain("We can't find that page")
      expect(openURLMock).not.toHaveBeenCalled()
      tree.root.findByType(Button).props.onPress()
      expect(openURLMock).toHaveBeenCalledWith("https://www.artsy.net/test-not-ok")
    })
  })

  it("shows an internal web view when there is no redirect", async () => {
    fetchMockResponseOnce({
      status: 200,
      url: "https://artsy.net/no-redirect",
    })
    const tree = renderWithWrappers(<VanityURLPossibleRedirect slug="no-redirect" />)
    await flushPromiseQueue()
    expect(tree.root.findAllByType(ArtsyWebView)).toHaveLength(1)
  })

  it("shows an internal web view when there is a redirect to a page that is supposed to be shown in a web view", async () => {
    fetchMockResponseOnce({
      status: 200,
      url: "https://artsy.net/categories",
    })
    const tree = renderWithWrappers(<VanityURLPossibleRedirect slug="genes" />)
    await flushPromiseQueue()
    expect(tree.root.findAllByType(ArtsyWebView)).toHaveLength(1)
  })
})
