import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Text } from "react-native"
import { renderWithPlaceholder } from "../renderWithPlaceholder"

describe(renderWithPlaceholder, () => {
  it(`renders the placeholder while the graphqls are loading`, () => {
    const result = renderWithPlaceholder({
      Container: () => null,
      renderPlaceholder: () => <Text>this is the placeholder</Text>,
    })({ error: null, props: null, retry: () => null })

    expect(React.isValidElement(result)).toBeTruthy()

    // @ts-ignore STRICTNESS_MIGRATION
    const tree = renderWithWrappers(result)
    expect(extractText(tree.root)).toBe("this is the placeholder")
  })
  it(`renders the real content when the graphqls are done`, () => {
    const result = renderWithPlaceholder({
      Container: () => <Text>the real content</Text>,
      renderPlaceholder: () => <Text>this is the placeholder</Text>,
    })({ error: null, props: {}, retry: () => null })
    expect(React.isValidElement(result)).toBeTruthy()
    // @ts-ignore STRICTNESS_MIGRATION
    const tree = renderWithWrappers(result)
    expect(extractText(tree.root)).toBe("the real content")
  })
})
