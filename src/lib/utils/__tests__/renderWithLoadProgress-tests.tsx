import Spinner from "lib/Components/Spinner"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Text } from "react-native"
import renderWithLoadProgress from "../renderWithLoadProgress"

describe(renderWithLoadProgress, () => {
  it(`renders a spinner while the graphqls are loaeding`, () => {
    const result = renderWithLoadProgress(() => null, {})({ error: null, props: null, retry: () => null })

    expect(React.isValidElement(result)).toBeTruthy()

    // @ts-ignore STRICTNESS_MIGRATION
    const tree = renderWithWrappers(result)
    expect(tree.root.findByType(Spinner)).toBeTruthy()
  })
  it(`renders the real content when the graphqls are done`, () => {
    const result = renderWithLoadProgress(
      () => <Text>the real content</Text>,
      {}
    )({ error: null, props: {}, retry: () => null })
    expect(React.isValidElement(result)).toBeTruthy()
    // @ts-ignore STRICTNESS_MIGRATION
    const tree = renderWithWrappers(result)
    expect(extractText(tree.root)).toBe("the real content")
  })
})
