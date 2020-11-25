// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { mount, shallow } from "enzyme"
import { LinkText } from "lib/Components/Text/LinkText"
import { Flex, Sans, Serif, Text, Theme } from "palette"
import React from "react"
import { defaultRules, renderMarkdown } from "../renderMarkdown"

import { readFileSync } from "fs"
import { navigate } from "lib/navigation/navigate"
import { join } from "path"

describe("renderMarkdown", () => {
  it("returns markdown for a simple string", () => {
    expect(renderMarkdown("")).toMatchInlineSnapshot(`
                        Array [
                          <Text />,
                        ]
                `)
  })

  it("returns markdown for multiple paragraphs", () => {
    const componentList = renderMarkdown("This is a first paragraph\n\nThis is a second paragraph") as any
    expect(componentList.length).toEqual(4)

    const renderedComponent = shallow(<Flex>{componentList}</Flex>)
    expect(renderedComponent.find(Sans).at(0).text()).toEqual("This is a first paragraph")

    expect(renderedComponent.find(Sans).at(1).text()).toEqual("This is a second paragraph")
  })

  it("returns markdown with the new style", () => {
    const componentList = renderMarkdown(
      "This is a first paragraph\n\nThis is a second paragraph",
      defaultRules({ useNewTextStyles: true })
    ) as any
    expect(componentList.length).toEqual(4)

    const renderedComponent = shallow(<Flex>{componentList}</Flex>)
    expect(renderedComponent.find(Sans).length).toEqual(0)
    expect(renderedComponent.find(Text).length).toEqual(2)
  })

  it("returns markdown for multiple paragraphs and links", () => {
    const componentList = renderMarkdown(
      "This is a [first](/artist/first) paragraph\n\nThis is a [second](/gene/second) paragraph"
    ) as any
    expect(componentList.length).toEqual(4)

    const renderedComponent = shallow(<Flex>{componentList}</Flex>)
    expect(renderedComponent.find(Sans).length).toEqual(2)
    expect(renderedComponent.find(LinkText).length).toEqual(2)

    expect(renderedComponent.find(Sans).at(0).text()).toEqual("This is a first paragraph")

    expect(renderedComponent.find(LinkText).at(0).text()).toEqual("first")

    expect(renderedComponent.find(Sans).at(1).text()).toEqual("This is a second paragraph")

    expect(renderedComponent.find(LinkText).at(1).text()).toEqual("second")
  })

  it("handles custom rules", () => {
    const basicRules = defaultRules({})
    const customRules = {
      ...basicRules,
      paragraph: {
        ...basicRules.paragraph,
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        react: (node, output, state) => {
          return (
            <Serif size="3t" color="black60" key={state.key}>
              {output(node.content, state)}
            </Serif>
          )
        },
      },
    }

    const componentList = renderMarkdown("This is a first paragraph\n\nThis is a second paragraph", customRules) as any
    expect(componentList.length).toEqual(4)

    const renderedComponent = shallow(<Flex>{componentList}</Flex>)
    expect(renderedComponent.find(Sans).length).toEqual(0)
    expect(renderedComponent.find(Serif).length).toEqual(2)

    expect(renderedComponent.find(Serif).at(0).text()).toEqual("This is a first paragraph")

    expect(renderedComponent.find(Serif).at(1).text()).toEqual("This is a second paragraph")
  })

  it("opens links modally when specified", () => {
    const basicRules = defaultRules({ modal: true })
    const customRules = {
      ...basicRules,
      paragraph: {
        ...basicRules.paragraph,
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        react: (node, output, state) => {
          return (
            <Serif size="3t" color="black60" key={state.key}>
              {output(node.content, state)}
            </Serif>
          )
        },
      },
    }
    const componentList = renderMarkdown(
      "This is a [first](/artist/first) paragraph\n\nThis is a [second](/gene/second) paragraph",
      customRules
    ) as any

    const renderedComponent = mount(
      <Theme>
        <Flex>{componentList}</Flex>
      </Theme>
    )
    expect(renderedComponent.find(LinkText).length).toEqual(2)

    renderedComponent.find(LinkText).at(0).props().onPress()

    expect(navigate).toHaveBeenCalledWith("/artist/first", { modal: true })
  })

  it("doesn't open links modally when not specified", () => {
    const basicRules = defaultRules({})
    const customRules = {
      ...basicRules,
      paragraph: {
        ...basicRules.paragraph,
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        react: (node, output, state) => {
          return (
            <Serif size="3t" color="black60" key={state.key}>
              {output(node.content, state)}
            </Serif>
          )
        },
      },
    }
    const componentList = renderMarkdown(
      "This is a [first](/artist/first) paragraph\n\nThis is a [second](/gene/second) paragraph",
      customRules
    ) as any

    const renderedComponent = mount(
      <Theme>
        <Flex>{componentList}</Flex>
      </Theme>
    )
    expect(renderedComponent.find(LinkText).length).toEqual(2)

    renderedComponent.find(LinkText).at(0).props().onPress()

    expect(navigate).toHaveBeenCalledWith("/artist/first")
  })

  it(`renders all the markdown elements`, async () => {
    const basicRules = defaultRules({})
    const kitchenSink = readFileSync(join(__dirname, "markdown-kitchen-sink.md")).toString()

    const tree = renderMarkdown(kitchenSink, basicRules)

    visitTree(tree, (node) => {
      if (typeof node.type === "string") {
        throw Error(`we should be supporting elements with type '${node.type}'`)
      }
    })
  })
})

function visitTree(tree: unknown, visit: (node: React.ReactElement) => void) {
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  if (React.isValidElement(tree)) {
    visit(tree)
    React.Children.forEach((tree.props as any).children, (child) => visitTree(child, visit))
  } else if (Array.isArray(tree)) {
    tree.map((child) => visitTree(child, visit))
  }
}
