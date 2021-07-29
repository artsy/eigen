import { ArtsyWebView } from "lib/Components/ArtsyWebView"
import { navigate } from "lib/navigation/navigate"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { extractText } from "lib/tests/extractText"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Button, Spinner } from "palette"
import React from "react"
import { Linking } from "react-native"
import { VanityURLPossibleRedirect } from "../VanityURLPossibleRedirect"

const fetchMock = ((global as any).fetch = jest.fn())

beforeEach(() => {
  __globalStoreTestUtils__?.setProductionMode()
  fetchMock.mockReset()
})

describe(VanityURLPossibleRedirect, () => {
  it("shows a loading spinner before anything has happened", () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      url: "https://artsy.net/test",
    })
    const tree = renderWithWrappers(<VanityURLPossibleRedirect slug="test" />)
    expect(tree.root.findAllByType(Spinner)).toHaveLength(1)
  })

  it("sends a fetch request", () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      url: "https://artsy.net/test",
    })
    renderWithWrappers(<VanityURLPossibleRedirect slug="test" />)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "https://artsy.net/test",
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
    fetchMock.mockResolvedValueOnce({
      ok: true,
      url: "https://google.com/blah",
    })
    renderWithWrappers(<VanityURLPossibleRedirect slug="test" />)
    await flushPromiseQueue()
    expect(navigate).toHaveBeenCalledWith("https://google.com/blah")
  })

  it("calls `navigate` when the redirect points to a native view", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      url: "https://artsy.net/artist/banksy",
    })
    renderWithWrappers(<VanityURLPossibleRedirect slug="test" />)
    await flushPromiseQueue()
    expect(navigate).toHaveBeenCalledWith("https://artsy.net/artist/banksy")
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
      fetchMock.mockRejectedValueOnce({})
      const tree = renderWithWrappers(<VanityURLPossibleRedirect slug="test-fail" />)
      await flushPromiseQueue()
      expect(extractText(tree.root)).toContain("We can't find that page")
      expect(openURLMock).not.toHaveBeenCalled()
      tree.root.findByType(Button).props.onPress()
      expect(openURLMock).toHaveBeenCalledWith("https://artsy.net/test-fail")
    })

    it("shows the error page if the response is not `ok`", async () => {
      fetchMock.mockResolvedValueOnce({ ok: false, url: "https://whatever" })
      const tree = renderWithWrappers(<VanityURLPossibleRedirect slug="test-not-ok" />)
      await flushPromiseQueue()
      expect(extractText(tree.root)).toContain("We can't find that page")
      expect(openURLMock).not.toHaveBeenCalled()
      tree.root.findByType(Button).props.onPress()
      expect(openURLMock).toHaveBeenCalledWith("https://artsy.net/test-not-ok")
    })
  })

  it("shows an internal web view when there is no redirect", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, url: "https://artsy.net/no-redirect" })
    const tree = renderWithWrappers(<VanityURLPossibleRedirect slug="no-redirect" />)
    await flushPromiseQueue()
    expect(tree.root.findAllByType(ArtsyWebView)).toHaveLength(1)
  })

  it("shows an internal web view when there is a redirect to a page that is supposed to be shown in a web view", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, url: "https://artsy.net/categories" })
    const tree = renderWithWrappers(<VanityURLPossibleRedirect slug="genes" />)
    await flushPromiseQueue()
    expect(tree.root.findAllByType(ArtsyWebView)).toHaveLength(1)
  })
})
