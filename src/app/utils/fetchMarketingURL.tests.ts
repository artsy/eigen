import { captureMessage } from "@sentry/react-native"
import { fetchMarketingURL } from "./fetchMarketingURL"

jest.mock("@sentry/react-native", () => ({
  captureMessage: jest.fn(),
}))

const MARKETING_URL = "https://email-link.artsy.net/ls/click?upn=abc"
const ARTWORK_URL = "https://www.artsy.net/artwork/some-artwork?utm_source=sendgrid"

const mockResponse = ({
  ok,
  status,
  url,
  body = "",
}: {
  ok: boolean
  status: number
  url: string
  body?: string
}) => ({ ok, status, url, text: () => Promise.resolve(body) }) as unknown as Response

describe("fetchMarketingURL", () => {
  const fetchMock = jest.fn()
  const originalFetch = global.fetch
  const originalDev = (global as any).__DEV__

  beforeEach(() => {
    // A plain mock rather than jest-fetch-mock, whose responses can't set `url`
    global.fetch = fetchMock as unknown as typeof global.fetch
    // captureFetchError only reports to Sentry outside __DEV__
    ;(global as any).__DEV__ = false
    fetchMock.mockReset()
    ;(captureMessage as jest.Mock).mockClear()
  })

  afterAll(() => {
    global.fetch = originalFetch
    ;(global as any).__DEV__ = originalDev
  })

  it("returns the URL the marketing link redirected to", async () => {
    fetchMock.mockResolvedValue(mockResponse({ ok: true, status: 200, url: ARTWORK_URL }))

    expect(await fetchMarketingURL(MARKETING_URL)).toBe(ARTWORK_URL)
    expect(captureMessage).not.toHaveBeenCalled()
  })

  it("returns the redirected URL when the artsy.net page there answers 403 (Cloudflare challenge)", async () => {
    fetchMock.mockResolvedValue(mockResponse({ ok: false, status: 403, url: ARTWORK_URL }))

    expect(await fetchMarketingURL(MARKETING_URL)).toBe(ARTWORK_URL)
    expect(captureMessage).not.toHaveBeenCalled()
  })

  it("fails when the marketing link itself answers with an error, without a redirect", async () => {
    fetchMock.mockResolvedValue(mockResponse({ ok: false, status: 403, url: MARKETING_URL }))

    expect(await fetchMarketingURL(MARKETING_URL)).toBeNull()
    expect(captureMessage).toHaveBeenCalledTimes(1)
  })

  it("fails when an error page isn't on artsy.net", async () => {
    fetchMock.mockResolvedValue(
      mockResponse({ ok: false, status: 404, url: "https://example.com/artwork/some-artwork" })
    )

    expect(await fetchMarketingURL(MARKETING_URL)).toBeNull()
    expect(captureMessage).toHaveBeenCalledTimes(1)
  })

  it("fails when an error page is another marketing link, so it can't loop", async () => {
    fetchMock.mockResolvedValue(
      mockResponse({ ok: false, status: 403, url: "https://click.artsy.net/ls/click?upn=xyz" })
    )

    expect(await fetchMarketingURL(MARKETING_URL)).toBeNull()
  })

  it("doesn't take a look-alike host for artsy.net", async () => {
    fetchMock.mockResolvedValue(
      mockResponse({ ok: false, status: 403, url: "https://www.notartsy.net/artwork/some-artwork" })
    )

    expect(await fetchMarketingURL(MARKETING_URL)).toBeNull()
  })

  it("reads the destination from the page when the response URL wasn't updated (Android)", async () => {
    fetchMock.mockResolvedValue(
      mockResponse({
        ok: true,
        status: 200,
        url: MARKETING_URL,
        body: `<link rel="canonical" href="${ARTWORK_URL}">`,
      })
    )

    expect(await fetchMarketingURL(MARKETING_URL)).toBe(ARTWORK_URL)
  })

  it("returns null and reports when the request fails", async () => {
    fetchMock.mockRejectedValue(new Error("The network connection was lost."))

    expect(await fetchMarketingURL(MARKETING_URL)).toBeNull()
    expect(captureMessage).toHaveBeenCalledTimes(1)
  })
})
