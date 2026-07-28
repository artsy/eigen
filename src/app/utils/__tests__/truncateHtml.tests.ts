import { truncateHtml, visibleHtmlTextLength } from "app/utils/truncateHtml"

describe("visibleHtmlTextLength", () => {
  it("returns the string length when there are no tags", () => {
    expect(visibleHtmlTextLength("No tags here")).toEqual(12)
  })

  it("excludes tags from the count", () => {
    expect(visibleHtmlTextLength("<p>Hello <em>world</em></p>")).toEqual(11)
  })

  it("returns zero for an empty string", () => {
    expect(visibleHtmlTextLength("")).toEqual(0)
  })
})

describe("truncateHtml", () => {
  it("behaves like a plain slice when there is no markup", () => {
    expect(truncateHtml("Hello world", 5)).toEqual("Hello")
  })

  it("returns the entire string when the budget exceeds the visible text length", () => {
    const html = "<p>Hi</p>"
    expect(truncateHtml(html, 100)).toEqual(html)
  })

  it("does not count tag markup toward the visible character budget", () => {
    const html = "<p>Hello</p>"
    expect(truncateHtml(html, 5)).toEqual("<p>Hello</p>")
  })

  it("stops as soon as the visible character budget is reached, dropping trailing markup", () => {
    const html = "<p>Hello world</p>"
    expect(truncateHtml(html, 5)).toEqual("<p>Hello")
  })

  it("never cuts in the middle of a tag or attribute", () => {
    const html =
      '<a href="https://www.artsy.net/artist/david-hockney">Hockney</a> retrospective'

    const result = truncateHtml(html, 3)

    expect(result).toEqual('<a href="https://www.artsy.net/artist/david-hockney">Hoc')
    expect(visibleHtmlTextLength(result)).toEqual(3)
  })
})
