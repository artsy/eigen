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

  it("counts a named entity reference as a single visible character", () => {
    expect(visibleHtmlTextLength("Hauser &amp; Wirth")).toEqual(14)
  })

  it("counts a numeric entity reference as a single visible character", () => {
    expect(visibleHtmlTextLength("Rock &#38; Roll")).toEqual(11)
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

  it("does not cut in the middle of an entity reference", () => {
    const result = truncateHtml("Arts &amp; Crafts", 7)

    expect(result).toEqual("Arts &amp; ")
    expect(visibleHtmlTextLength(result)).toEqual(7)
  })

  it("treats a bare ampersand that is not part of an entity as a normal character", () => {
    expect(truncateHtml("Fish & Chips", 6)).toEqual("Fish &")
  })

  it("stops before a new tag opens once the budget is spent, without leaving it dangling open", () => {
    const html = "<p>abc</p><h3>Key Exhibitions</h3>"
    expect(truncateHtml(html, 3)).toEqual("<p>abc</p>")
  })

  it("still emits closing tags for elements opened before the budget was spent", () => {
    const html = "<p>abc</p>"
    expect(truncateHtml(html, 3)).toEqual(html)
  })
})
