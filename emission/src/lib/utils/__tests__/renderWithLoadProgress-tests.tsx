import Spinner from "lib/Components/Spinner"
import { extractText } from "lib/tests/extractText"
import React from "react"
import { Text } from "react-native"
import ReactTestRenderer from "react-test-renderer"
import renderWithLoadProgress from "../renderWithLoadProgress"

describe(renderWithLoadProgress, () => {
  it(`renders a spinner while the graphqls are loaeding`, () => {
    const result = renderWithLoadProgress(() => null, {})({ error: null, props: null, retry: () => null })

    expect(React.isValidElement(result)).toBeTruthy()

    const tree = ReactTestRenderer.create(result)
    expect(tree.root.findByType(Spinner)).toBeTruthy()
  })
  it(`renders the real content when the graphqls are done`, () => {
    const result = renderWithLoadProgress(
      () => <Text>the real content</Text>,
      {}
    )({ error: null, props: {}, retry: () => null })
    expect(React.isValidElement(result)).toBeTruthy()
    const tree = ReactTestRenderer.create(result)
    expect(extractText(tree.root)).toBe("the real content")
  })
})
