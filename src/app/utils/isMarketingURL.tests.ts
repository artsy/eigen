import { isMarketingURL } from "./isMarketingURL"

describe("isMarketingURL", () => {
  it("returns true for click.artsy.net URLs", () => {
    expect(isMarketingURL("https://click.artsy.net/track/123")).toBe(true)
    expect(isMarketingURL("http://click.artsy.net/abc")).toBe(true)
    expect(isMarketingURL("https://www.click.artsy.net/xyz")).toBe(true)
  })

  it("returns true for email-link.artsy.net URLs", () => {
    expect(isMarketingURL("https://email-link.artsy.net/track/456")).toBe(true)
    expect(isMarketingURL("http://email-link.artsy.net/def")).toBe(true)
    expect(isMarketingURL("https://www.email-link.artsy.net/uvw")).toBe(true)
  })

  it("returns false for non-marketing URLs", () => {
    expect(isMarketingURL("https://www.artsy.net/some-page")).toBe(false)
    expect(isMarketingURL("https://example.com")).toBe(false)
    expect(isMarketingURL("https://artsynet.click.com")).toBe(false)
    expect(isMarketingURL("https://email-link.notartsy.net")).toBe(false)
  })

  it("returns false for empty string", () => {
    expect(isMarketingURL("")).toBe(false)
  })
})
