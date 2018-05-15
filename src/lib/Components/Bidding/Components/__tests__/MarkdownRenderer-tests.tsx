import { shallow } from "enzyme"
import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import { BiddingThemeProvider } from "../BiddingThemeProvider"
import { markdownLinkRegex, MarkdownRenderer } from "../MarkdownRenderer"

describe("Markdown parser regex", () => {
  describe("matches different kind of links.", () => {
    const links = [
      {
        md: "a markdown text with [href-link](http://example.com) and text",
        link: "http://example.com",
        text: "href-link",
      },
      {
        md: "text with [mailto](mailto:someone@example.com) and text",
        link: "mailto:someone@example.com",
        text: "mailto",
      },
      {
        md: "[te%t ^^it2 $p3ci<l chars](https://web-s1te.com/#aaa?bb=cc) and text",
        link: "https://web-s1te.com/#aaa?bb=cc",
        text: "te%t ^^it2 $p3ci<l chars",
      },
    ]
    links.forEach((item, i) => {
      it(`type ${i}:`, () => {
        const re = new RegExp(markdownLinkRegex)
        const found = re.exec(item.md)
        expect(found[1]).toMatch(item.text)
        expect(found[2]).toMatch(item.link)
      })
    })
  })

  it("matches multiple links", () => {
    const md =
      "text [href-link](http://example.com) text [te%t ^^it2 $p3ci<l chars](https://web-s1te.com/#aaa?bb=cc) and text and [not link] (not link)"
    const re = new RegExp(markdownLinkRegex)
    const found = md.match(re)
    expect(found).toHaveLength(2)
  })
})

describe("Markdown parser component", () => {
  describe("renders text", () => {
    const md = "text without link"
    const component = (
      <BiddingThemeProvider>
        <MarkdownRenderer>{md}</MarkdownRenderer>
      </BiddingThemeProvider>
    )

    it("matches the snapshot", () => {
      const bg = renderer.create(component).toJSON()
      expect(bg).toMatchSnapshot()
    })

    // TODO: Fix! it was working but now (markdown.debug() returns <undefined />
    xit("renders the paragraph as Text element", () => {
      const markdown = shallow(<MarkdownRenderer>{md}</MarkdownRenderer>)
      expect(markdown.find("Paragraph")).toHaveLength(1)
      expect(
        markdown
          .find("Paragraph")
          .find("Text")
          .prop("children")
      ).toMatch("text without link")
    })
  })
  describe("renders text with link", () => {
    const md = "text with some [link](http://example.com) in it"
    const component = (
      <BiddingThemeProvider>
        <MarkdownRenderer>{md}</MarkdownRenderer>
      </BiddingThemeProvider>
    )
    it("matches the snapshot", () => {
      const bg = renderer.create(component).toJSON()
      expect(bg).toMatchSnapshot()
    })

    // TODO: Fix! it was working but now (markdown.debug() returns <undefined />
    xit("renders the paragraph and link as Text elements", () => {
      const markdown = shallow(<MarkdownRenderer>{md}</MarkdownRenderer>)
      expect(markdown.find("Text")).toHaveLength(3)
      expect(
        markdown
          .find("Text")
          .at(1)
          .prop("children")
      ).toMatch("link")
    })
  })

  describe("renders multiple paragraphs", () => {
    const md = `paragraph 1 has some text

paragraph 2 also has text`
    const component = (
      <BiddingThemeProvider>
        <MarkdownRenderer>{md}</MarkdownRenderer>
      </BiddingThemeProvider>
    )

    it("matches the snapshot", () => {
      const bg = renderer.create(component).toJSON()
      expect(bg).toMatchSnapshot()
    })

    // TODO: Fix! it was working but now (markdown.debug() returns <undefined />
    xit("renders multiple paragraphs as Text elements", () => {
      const markdown = shallow(<MarkdownRenderer>{md}</MarkdownRenderer>)
      expect(markdown.find("Text")).toHaveLength(2)

      expect(
        markdown
          .find("Text")
          .first()
          .prop("children")
      ).toMatch("paragraph 1 has some text")

      expect(
        markdown
          .find("Text")
          .last()
          .prop("children")
      ).toMatch("paragraph 2 also has text")
    })
  })
})
