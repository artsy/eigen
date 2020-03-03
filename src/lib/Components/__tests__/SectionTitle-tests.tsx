import { ArrowRightIcon, Theme } from "@artsy/palette"
import { extractText } from "lib/tests/extractText"
import React from "react"
import { create } from "react-test-renderer"
import { SectionTitle } from "../SectionTitle"

const render = (jsx: JSX.Element) => create(<Theme>{jsx}</Theme>)

describe("SectionTitle", () => {
  it(`renders a title alone`, async () => {
    const tree = render(<SectionTitle title="hello" />)

    expect(extractText(tree.root)).toContain("hello")
    expect(tree.root.findAllByType(ArrowRightIcon)).toHaveLength(0)
    expect(tree.root.findAllByProps({ "data-test-id": "subtitle" })).toHaveLength(0)
  })

  it(`renders a subtitle when specified`, async () => {
    const tree = render(<SectionTitle title="hello" subtitle="welcome to test" />)

    expect(extractText(tree.root.findByProps({ "data-test-id": "title" }))).toContain("hello")
    expect(extractText(tree.root.findByProps({ "data-test-id": "subtitle" }))).toBe("welcome to test")
    expect(tree.root.findAllByType(ArrowRightIcon)).toHaveLength(0)
  })

  it(`renders a right arrow when given an 'onPress' prop`, async () => {
    const onPress = jest.fn()
    const tree = render(<SectionTitle title="hello" subtitle="welcome to test" onPress={onPress} />)

    expect(extractText(tree.root.findByProps({ "data-test-id": "title" }))).toContain("hello")
    expect(extractText(tree.root.findByProps({ "data-test-id": "subtitle" }))).toBe("welcome to test")
    expect(tree.root.findAllByType(ArrowRightIcon)).toHaveLength(1)
    tree.root.findByProps({ "data-test-id": "touchable-wrapper" }).props.onPress()
    expect(onPress).toHaveBeenCalled()
  })
})
