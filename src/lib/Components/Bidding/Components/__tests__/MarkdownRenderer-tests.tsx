// import { shallow } from "enzyme"
import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import { BiddingThemeProvider } from "../BiddingThemeProvider"
import { MarkdownRenderer } from "../MarkdownRenderer"

describe("Markdown parser", () => {
  it("renders text only", () => {
    const md = "text without link"
    const component = (
      <BiddingThemeProvider>
        <MarkdownRenderer>{md}</MarkdownRenderer>
      </BiddingThemeProvider>
    )

    // const markdown = shallow(<MarkdownRenderer>{md}</MarkdownRenderer>)
    // console.log(markdown.find("Paragraph"), markdown.find("Text"))
    // expect(markdown.find("Paragraph")).toHaveLength(1)
    // expect(
    //   markdown
    //     .find("Paragraph")
    //     .find("Text")
    //     .prop("children")
    // ).toMatch("text without link")

    const bg = renderer.create(component).toJSON()
    expect(bg).toMatchSnapshot()
  })
  it("renders text with link", () => {
    const md = "text with some [link](http://example.com) in it"
    const component = (
      <BiddingThemeProvider>
        <MarkdownRenderer>{md}</MarkdownRenderer>
      </BiddingThemeProvider>
    )

    // TODO: Fix! it was working but now (markdown.debug() returns <undefined />
    // const markdown = shallow(<MarkdownRenderer>{md}</MarkdownRenderer>)
    // console.log(markdown.debug())
    // console.log(markdown.find("Paragraph"), markdown.find("Text"))
    // expect(markdown.find("Text")).toHaveLength(3)
    // expect(
    //   markdown
    //     .find("Text")
    //     .at(1)
    //     .prop("children")
    // ).toMatch("link")

    const bg = renderer.create(component).toJSON()
    expect(bg).toMatchSnapshot()
  })

  it("renders multiple paragraphs", () => {
    const md = `paragraph 1 has some text

paragraph 2 also has text`
    const component = (
      <BiddingThemeProvider>
        <MarkdownRenderer>{md}</MarkdownRenderer>
      </BiddingThemeProvider>
    )

    // const markdown = shallow(<MarkdownRenderer>{md}</MarkdownRenderer>)
    // expect(markdown.find("Text")).toHaveLength(2)

    // expect(
    //   markdown
    //     .find("Text")
    //     .first()
    //     .prop("children")
    // ).toMatch("paragraph 1 has some text")

    // expect(
    //   markdown
    //     .find("Text")
    //     .last()
    //     .prop("children")
    // ).toMatch("paragraph 2 also has text")

    const bg = renderer.create(component).toJSON()
    expect(bg).toMatchSnapshot()
  })
})
