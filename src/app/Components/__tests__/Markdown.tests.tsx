import { LinkText } from "@artsy/palette-mobile"
import { Markdown } from "app/Components/Markdown"
import { navigate } from "app/system/navigation/navigate"
import { defaultRules, MarkdownRules } from "app/utils/renderMarkdown"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { Linking, Text } from "react-native"

describe("Markdown", () => {
  it("renders multiple paragraphs as Text elements", () => {
    const markdown = renderWithWrappersLEGACY(
      <Markdown>
        paragraph 1 has some text.
        {"\n"}
        {"\n"}
        paragraph 2 also has text.
      </Markdown>
    )

    expect(markdown.root.findAllByType(Text).length).toEqual(4)
    expect(markdown.root.findAllByType(Text)[0].props.children[0]).toMatch(
      "paragraph 1 has some text"
    )
    expect(markdown.root.findAllByType(Text)[2].props.children[0]).toMatch(
      "paragraph 2 also has text"
    )
  })

  it("renders links as LinkText", () => {
    const markdown = renderWithWrappersLEGACY(
      <Markdown>
        Sorry, your bid wasn’t received before
        {"\n"}
        live bidding started. To continue
        {"\n"}
        bidding, please [join the live auction](http://www.artsy.net).
      </Markdown>
    )

    expect(markdown.root.findAllByType(LinkText).length).toEqual(1)
    expect(markdown.root.findAllByType(LinkText)[0].props.children[0]).toMatch(
      "join the live auction"
    )

    markdown.root.findAllByType(LinkText)[0].props.onPress()

    expect(navigate).toHaveBeenCalledWith("http://www.artsy.net", { modal: true })
  })

  it("renders mailto links as LinkText", async () => {
    Linking.canOpenURL = jest.fn().mockReturnValue(Promise.resolve(true))
    Linking.openURL = jest.fn()

    const markdown = renderWithWrappersLEGACY(
      <Markdown>
        Your bid can’t be placed at this time.
        {"\n"}
        Please contact [support@artsy.net](mailto:support@artsy.net) for
        {"\n"}
        more information.
      </Markdown>
    )

    expect(markdown.root.findAllByType(LinkText).length).toEqual(1)
    expect(markdown.root.findAllByType(LinkText)[0].props.children[0]).toMatch("support@artsy.net")

    await markdown.root.findAllByType(LinkText)[0].props.onPress()
    expect(Linking.openURL).toBeCalledWith("mailto:support@artsy.net")
  })

  it("accepts a rules prop", () => {
    const basicRules = defaultRules({ modal: true })
    const rules = {
      ...basicRules,
      paragraph: {
        ...basicRules.paragraph,
        react: (node, output, state) => <Text testID="foobar">{output(node.content, state)}</Text>,
      },
    } as MarkdownRules
    const markdown = renderWithWrappersLEGACY(
      <Markdown rules={rules}>Paragraph 1 has some text</Markdown>
    )

    expect(markdown.root.findAllByType(Text)[0].props.testID).toBe("foobar")
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
