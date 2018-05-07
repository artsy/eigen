import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import { MarkdownRenderer } from "../MarkdownRenderer"

describe("Markdown parser", () => {
  it("parses", () => {
    const md = "text with some [link](http://example.com) in it"
    const bg = renderer.create(<MarkdownRenderer md={md} />).toJSON()
    expect(bg).toMatchSnapshot()
  })
})
