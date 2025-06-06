import { readFileSync } from "fs"
import { join } from "path"
import { Flex, Text } from "@artsy/palette-mobile"
import { fireEvent, within } from "@testing-library/react-native"
import { navigate } from "app/system/navigation/navigate"
import { defaultRules, renderMarkdown } from "app/utils/renderMarkdown"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import React from "react"

describe("renderMarkdown", () => {
  it("returns markdown for a simple string", () => {
    expect(renderMarkdown("")).toMatchInlineSnapshot(`
      [
        <Text />,
      ]
    `)
  })

  it("returns markdown for multiple paragraphs", () => {
    const componentList = renderMarkdown(
      "This is a first paragraph\n\nThis is a second paragraph"
    ) as any
    expect(componentList.length).toEqual(4)

    const { queryByText } = renderWithWrappers(<Flex>{componentList}</Flex>)
    expect(queryByText("This is a first paragraph")).toBeTruthy()
    expect(queryByText("This is a second paragraph")).toBeTruthy()
  })

  it("returns markdown for multiple paragraphs and links", () => {
    const componentList = renderMarkdown(
      "This is a [first](/artist/first) paragraph\n\nAnd that is a [second](/gene/second) paragraph"
    ) as any
    expect(componentList.length).toEqual(4)

    const { getByText, queryAllByTestId } = renderWithWrappers(<Flex>{componentList}</Flex>)

    expect(queryAllByTestId(/linktext-/)).toHaveLength(2)

    // ensures that there is a <Text> element that includes another one with "first" in it
    expect(within(getByText(/This is a/)).getByText(/first/)).toBeTruthy()
    // ensures that there is a <Text> element that includes another one with "paragraph" in it
    expect(within(getByText(/This is a/)).getByText(/paragraph/)).toBeTruthy()

    expect(extractText(queryAllByTestId(/linktext-/)[0])).toEqual("first")

    // ensures that there is a <Text> element that includes another one with "second" in it
    expect(within(getByText(/And that is a/)).getByText(/second/)).toBeTruthy()

    // ensures that there is a <Text> element that includes another one with "paragraph" in it
    expect(within(getByText(/And that is a/)).getByText(/paragraph/)).toBeTruthy()

    expect(extractText(queryAllByTestId(/linktext-/)[1])).toEqual("second")
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
            <Text variant="sm" color="mono60" key={state.key}>
              {output(node.content, state)}
            </Text>
          )
        },
      },
    }
    const componentList = renderMarkdown(
      "This is a first paragraph\n\nThis is a second paragraph",
      customRules
    ) as any
    expect(componentList.length).toEqual(4)
    const { queryByText } = renderWithWrappers(<Flex>{componentList}</Flex>)
    expect(queryByText("This is a first paragraph")).toBeTruthy()
    expect(queryByText("This is a second paragraph")).toBeTruthy()
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
            <Text variant="sm" color="mono60" key={state.key}>
              {output(node.content, state)}
            </Text>
          )
        },
      },
    }
    const componentList = renderMarkdown(
      "This is a [first](/artist/first) paragraph\n\nThis is a [second](/gene/second) paragraph",
      customRules
    ) as any

    const { queryAllByTestId } = renderWithWrappers(<Flex>{componentList}</Flex>)
    expect(queryAllByTestId(/linktext-/)).toHaveLength(2)

    fireEvent.press(queryAllByTestId(/linktext-/)[0])

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
            <Text variant="sm" color="mono60" key={state.key}>
              {output(node.content, state)}
            </Text>
          )
        },
      },
    }
    const componentList = renderMarkdown(
      "This is a [first](/artist/first) paragraph\n\nThis is a [second](/gene/second) paragraph",
      customRules
    ) as any

    const { queryAllByTestId } = renderWithWrappers(<Flex>{componentList}</Flex>)
    expect(queryAllByTestId(/linktext-/)).toHaveLength(2)

    fireEvent.press(queryAllByTestId(/linktext-/)[0])

    expect(navigate).toHaveBeenCalledWith("/artist/first")
  })

  it(`renders all the markdown elements`, async () => {
    const basicRules = defaultRules({})
    const kitchenSink = readFileSync(join(__dirname, "../markdown-kitchen-sink.md")).toString()

    const tree = renderMarkdown(kitchenSink, basicRules)

    visitTree(tree, (node) => {
      if (typeof node.type === "string") {
        throw Error(`we should be supporting elements with type '${node.type}'`)
      }
    })
  })
})

function visitTree(
  tree: React.ReactElement<any> | Array<React.ReactElement<any>>,
  visit: (node: React.ReactElement) => void
) {
  if (React.isValidElement(tree)) {
    visit(tree)
    React.Children.forEach((tree.props as any).children, (child) => visitTree(child, visit))
  } else if (Array.isArray(tree)) {
    tree.map((child) => visitTree(child, visit))
  }
}
