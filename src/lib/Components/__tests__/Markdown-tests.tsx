import React from "react"
import { Text } from "react-native"
import * as renderer from "react-test-renderer"

import { Theme } from "@artsy/palette"
import { defaultRules, Markdown } from "../Markdown"
import { LinkText } from "../Text/LinkText"

jest.mock("lib/NativeModules/SwitchBoard", () => ({ presentModalViewController: jest.fn() }))
import SwitchBoard from "lib/NativeModules/SwitchBoard"
const SwitchBoardMock = SwitchBoard as any
const { anything } = expect

beforeEach(() => {
  SwitchBoardMock.presentModalViewController.mockReset()
})

describe("Markdown", () => {
  it("renders multiple paragraphs as Text elements", () => {
    const markdown = renderer.create(
      <Theme>
        <Markdown>
          paragraph 1 has some text.
          {"\n"}
          {"\n"}
          paragraph 2 also has text.
        </Markdown>
      </Theme>
    )

    expect(markdown.root.findAllByType(Text).length).toEqual(4)
    expect(markdown.root.findAllByType(Text)[0].props.children[0]).toMatch("paragraph 1 has some text")
    expect(markdown.root.findAllByType(Text)[2].props.children[0]).toMatch("paragraph 2 also has text")
  })

  it("renders links as LinkText", () => {
    const markdown = renderer.create(
      <Theme>
        <Markdown>
          Sorry, your bid wasn’t received before
          {"\n"}
          live bidding started. To continue
          {"\n"}
          bidding, please [join the live auction](http://www.artsy.net).
        </Markdown>
      </Theme>
    )

    expect(markdown.root.findAllByType(LinkText).length).toEqual(1)
    expect(markdown.root.findAllByType(LinkText)[0].props.children[0]).toMatch("join the live auction")

    markdown.root.findAllByType(LinkText)[0].props.onPress()

    expect(SwitchBoardMock.presentModalViewController).toHaveBeenCalledWith(anything(), "http://www.artsy.net")
  })

  it("renders mailto links as LinkText", () => {
    const markdown = renderer.create(
      <Theme>
        <Markdown>
          Your bid can’t be placed at this time.
          {"\n"}
          Please contact [support@artsy.net](mailto:support@artsy.net) for
          {"\n"}
          more information.
        </Markdown>
      </Theme>
    )

    expect(markdown.root.findAllByType(LinkText).length).toEqual(1)
    expect(markdown.root.findAllByType(LinkText)[0].props.children[0]).toMatch("support@artsy.net")

    markdown.root.findAllByType(LinkText)[0].props.onPress()

    expect(SwitchBoardMock.presentModalViewController).toHaveBeenCalledWith(anything(), "mailto:support@artsy.net")
  })

  it("accepts a rules prop", () => {
    const rules = {
      ...defaultRules,
      paragraph: {
        ...defaultRules.paragraph,
        react: (node, output, state) => <Text testID="foobar">{output(node.content, state)}</Text>,
      },
    }
    const markdown = renderer.create(
      <Theme>
        <Markdown rules={rules}>Paragraph 1 has some text</Markdown>
      </Theme>
    )

    expect(markdown.root.findAllByType(Text)[0].props.testID).toBe("foobar")
  })
})

describe("defaultRules", () => {
  Object.keys(defaultRules).forEach(key => {
    if (key === "Array") {
      return
    }
    it(`has a match rule for ${key}`, () => {
      expect(defaultRules[key].match).toBeTruthy()
    })
  })
})

describe("should update", () => {
  it("will update with diffferent rules", () => {
    const rules = { a: {} }
    const Component = new Markdown({ rules })
    expect(Component.shouldComponentUpdate({ rules: { b: "bold" }, children: [] })).toBeTruthy()
  })

  it("won't update with the same rules and same children", () => {
    const rules = { a: {} }
    const Component = new Markdown({ rules, children: ["my md"] })
    expect(Component.shouldComponentUpdate({ rules, children: ["my md"] })).toBeFalsy()
  })

  it("will update with the same rules and different children", () => {
    const rules = { a: {} }
    const Component = new Markdown({ rules, children: ["my md"] })
    expect(Component.shouldComponentUpdate({ rules, children: ["your md"] })).toBeTruthy()
  })
})
