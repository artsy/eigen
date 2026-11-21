import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { Markdown } from "app/Components/Markdown"
import { navigate } from "app/system/navigation/navigate"
import { defaultRules, MarkdownRules } from "app/utils/renderMarkdown"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Linking, Text } from "react-native"

describe("Markdown", () => {
  it("renders multiple paragraphs as Text elements", () => {
    renderWithWrappers(
      <Markdown>
        paragraph 1 has some text.
        {"\n"}
        {"\n"}
        paragraph 2 also has text.
      </Markdown>
    )

    expect(screen.getAllByText(/.*/)).toHaveLength(4)
    expect(screen.getAllByText(/.*/)[0]).toHaveTextContent(/paragraph 1 has some text/)
    expect(screen.getAllByText(/.*/)[2]).toHaveTextContent(/paragraph 2 also has text/)
  })

  it("renders links as LinkText", () => {
    renderWithWrappers(
      <Markdown>
        Sorry, your bid wasn’t received before
        {"\n"}
        live bidding started. To continue
        {"\n"}
        bidding, please [join the live auction](http://www.artsy.net).
      </Markdown>
    )

    expect(screen.getAllByTestId(/^linktext-/)).toHaveLength(1)
    expect(screen.getAllByTestId(/^linktext-/)[0]).toHaveTextContent("join the live auction")

    fireEvent.press(screen.getAllByTestId(/^linktext-/)[0])

    expect(navigate).toHaveBeenCalledWith("http://www.artsy.net", { modal: true })
  })

  it("renders mailto links as LinkText", async () => {
    Linking.canOpenURL = jest.fn().mockReturnValue(Promise.resolve(true))
    Linking.openURL = jest.fn()

    renderWithWrappers(
      <Markdown>
        Your bid can’t be placed at this time.
        {"\n"}
        Please contact [support@artsy.net](mailto:support@artsy.net) for
        {"\n"}
        more information.
      </Markdown>
    )

    expect(screen.getAllByTestId(/^linktext-/)).toHaveLength(1)
    expect(screen.getAllByTestId(/^linktext-/)[0]).toHaveTextContent("support@artsy.net")

    fireEvent.press(screen.getAllByTestId(/^linktext-/)[0])
    await waitFor(() => expect(Linking.openURL).toBeCalledWith("mailto:support@artsy.net"))
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
    renderWithWrappers(<Markdown rules={rules}>Paragraph 1 has some text</Markdown>)

    expect(screen.getAllByText(/.*/)[0]).toHaveProp("testID", "foobar")
    expect(screen.getByTestId("foobar")).toHaveTextContent("Paragraph 1 has some text")
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
