import { truncateHtml } from "app/utils/truncateHtml"

describe("truncateHtml", () => {
  it("behaves like a plain slice when there is no markup", () => {
    const { text, wasTruncated } = truncateHtml("Hello world", 5)

    expect(text).toEqual("Hello")
    expect(wasTruncated).toBe(true)
  })

  it("returns the entire string, untruncated, when the budget exceeds the visible text length", () => {
    const html = "<p>Hi</p>"
    const { text, wasTruncated } = truncateHtml(html, 100)

    expect(text).toEqual(html)
    expect(wasTruncated).toBe(false)
  })

  it("does not count tag markup toward the visible character budget", () => {
    const html = "<p>Hello</p>"
    const { text, wasTruncated } = truncateHtml(html, 5)

    expect(text).toEqual("<p>Hello</p>")
    expect(wasTruncated).toBe(false)
  })

  it("stops as soon as the visible character budget is reached, dropping trailing markup", () => {
    const html = "<p>Hello world</p>"
    const { text, wasTruncated } = truncateHtml(html, 5)

    expect(text).toEqual("<p>Hello")
    expect(wasTruncated).toBe(true)
  })

  it("never cuts in the middle of a tag or attribute", () => {
    const html =
      '<a href="https://www.artsy.net/artist/david-hockney">Hockney</a> retrospective'

    const { text, wasTruncated } = truncateHtml(html, 3)

    expect(text).toEqual('<a href="https://www.artsy.net/artist/david-hockney">Hoc')
    expect(wasTruncated).toBe(true)
  })

  it("does not cut in the middle of an entity reference", () => {
    const { text } = truncateHtml("Arts &amp; Crafts", 7)

    expect(text).toEqual("Arts &amp; ")
  })

  it("treats a bare ampersand that is not part of an entity as a normal character", () => {
    const { text } = truncateHtml("Fish & Chips", 6)

    expect(text).toEqual("Fish &")
  })

  it("stops before a new tag opens once the budget is spent, without leaving it dangling open", () => {
    const html = "<p>abc</p><h3>Key Exhibitions</h3>"
    const { text } = truncateHtml(html, 3)

    expect(text).toEqual("<p>abc</p>")
  })

  it("still emits closing tags for elements opened before the budget was spent", () => {
    const html = "<p>abc</p>"
    const { text } = truncateHtml(html, 3)

    expect(text).toEqual(html)
  })

  it("keeps the returned text and wasTruncated flag consistent even on malformed HTML", () => {
    // An unterminated "<b" tag has no single answer for "how much is visible", but the
    // scanner's own text and wasTruncated always agree with each other by construction,
    // since both come from the same pass rather than two independently computed answers.
    const { text, wasTruncated } = truncateHtml("Hi <b", 5)

    expect(text).toEqual("Hi <b")
    expect(wasTruncated).toBe(false)
  })
})
