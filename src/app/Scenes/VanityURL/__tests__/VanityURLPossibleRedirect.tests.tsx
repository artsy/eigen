import { Spinner } from "@artsy/palette-mobile"
import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ArtsyWebView, ArtsyWebViewPage } from "app/Components/ArtsyWebView"
import { VanityURLPossibleRedirect } from "app/Scenes/VanityURL/VanityURLPossibleRedirect"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { fetchMockResponseOnce } from "app/utils/tests/fetchMockHelpers"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import fetchMock from "jest-fetch-mock"
import { Linking } from "react-native"

beforeEach(() => {
  __globalStoreTestUtils__?.setProductionMode()
  __globalStoreTestUtils__?.injectState({ auth: { userAccessToken: "authenticationToken" } })
  fetchMock.resetMocks()
})

describe(VanityURLPossibleRedirect, () => {
  it("shows a loading spinner before anything has happened", () => {
    fetchMockResponseOnce({ status: 200, url: "https://artsy.net/test" })

    renderWithWrappers(<VanityURLPossibleRedirect slug="test" />)
    expect(screen.UNSAFE_getAllByType(Spinner)).toHaveLength(1)
  })

  it("sends a fetch request", () => {
    fetchMockResponseOnce({ status: 200, url: "https://www.artsy.net/test" })

    renderWithWrappers(<VanityURLPossibleRedirect slug="test" />)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "https://www.artsy.net/test",
        {
          "headers": {
            "X-Access-Token": "authenticationToken",
          },
          "method": "HEAD",
        },
      ]
    `)
  })

  it("calls `navigate` when the redirect points to an external url", async () => {
    fetchMockResponseOnce({ status: 200, url: "https://google.com/blah" })

    renderWithWrappers(<VanityURLPossibleRedirect slug="test" />)
    await waitFor(() => expect(navigate).toBeCalled())
    expect(navigate).toHaveBeenCalledWith("https://google.com/blah")
  })

  it("calls `navigate` when the redirect points to a native view", async () => {
    fetchMockResponseOnce({ status: 200, url: "https://www.artsy.net/artist/banksy" })

    renderWithWrappers(<VanityURLPossibleRedirect slug="test" />)
    await waitFor(() => expect(navigate).toBeCalled())
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
      renderWithWrappers(<VanityURLPossibleRedirect slug="test-fail" />)

      await screen.findByText("We can't find that page.")
      expect(screen.getByText("We can't find that page.")).toBeOnTheScreen()
      expect(openURLMock).not.toHaveBeenCalled()

      fireEvent.press(screen.getByText("Open in browser"))
      expect(openURLMock).toHaveBeenCalledWith("https://www.artsy.net/test-fail")
    })

    it("shows the error page if the response is not `ok`", async () => {
      fetchMockResponseOnce({ status: 404, url: "https://whatever" })
      renderWithWrappers(<VanityURLPossibleRedirect slug="test-not-ok" />)

      await screen.findByText("We can't find that page.")
      expect(screen.getByText("We can't find that page.")).toBeOnTheScreen()
      expect(openURLMock).not.toHaveBeenCalled()

      fireEvent.press(screen.getByText("Open in browser"))
      expect(openURLMock).toHaveBeenCalledWith("https://www.artsy.net/test-not-ok")
    })
  })

  it("shows an internal web view when there is no redirect", async () => {
    fetchMockResponseOnce({ status: 200, url: "https://artsy.net/no-redirect" })
    renderWithWrappers(<VanityURLPossibleRedirect slug="no-redirect" />)

    await waitFor(() => expect(screen.UNSAFE_getAllByType(ArtsyWebView)).toHaveLength(1))
  })

  it("shows an internal web view when there is a redirect to a page that is supposed to be shown in a web view", async () => {
    fetchMockResponseOnce({ status: 200, url: "https://artsy.net/categories" })
    renderWithWrappers(<VanityURLPossibleRedirect slug="genes" />)

    await waitFor(() => expect(screen.UNSAFE_getAllByType(ArtsyWebViewPage)).toHaveLength(1))
  })
})
