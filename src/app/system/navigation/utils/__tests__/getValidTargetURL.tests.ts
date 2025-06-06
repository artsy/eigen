import * as sentry from "@sentry/react-native"
import { getValidTargetURL } from "app/system/navigation/utils/getValidTargetURL"
import fetchMock from "jest-fetch-mock"

describe("getValidTargetURL", () => {
  beforeAll(() => {
    fetchMock.enableMocks()
  })

  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it("should strip artsy protocol from the URL", async () => {
    const url = "artsy://artist/andy-warhol"
    const result = await getValidTargetURL(url)
    expect(result).toEqual("artist/andy-warhol")
  })

  it("should return the original URL if no redirects are necessary", async () => {
    const url = "https://www.artsy.net/artist/andy-warhol"
    const result = await getValidTargetURL(url)
    expect(result).toEqual(url)
  })

  it("should handle an error during fetch and log it if not in development", async () => {
    const url = "https://click.artsy.net/redirect"
    fetchMock.mockReject(new Error("Network failure"))

    // @ts-expect-error
    global.__DEV__ = false
    const spy = jest.spyOn(sentry, "captureMessage").mockImplementation()

    const result = await getValidTargetURL(url)
    expect(result).toEqual(url)
    expect(spy).toBeCalled()
    spy.mockRestore()
  })

  it("should correctly resolve redirected URL", async () => {
    const originalUrl = "https://click.artsy.net/redirect"
    const redirectedUrl = "https://www.artsy.net/feature"
    fetchMock.mockResponseOnce("", { url: redirectedUrl })

    const result = await getValidTargetURL(originalUrl)
    expect(result).toEqual(redirectedUrl)
  })
})
