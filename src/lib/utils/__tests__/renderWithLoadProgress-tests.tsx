import Spinner from "lib/Components/Spinner"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers_legacy } from "lib/tests/renderWithWrappers"
import React from "react"
import { Text } from "react-native"
import renderWithLoadProgress from "../renderWithLoadProgress"

describe(renderWithLoadProgress, () => {
  it(`renders a spinner while the graphqls are loaeding`, () => {
    const result = renderWithLoadProgress(() => null, {})({ error: null, props: null, retry: () => null })

    expect(React.isValidElement(result)).toBeTruthy()

    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const tree = renderWithWrappers_legacy(result)
    expect(tree.root.findByType(Spinner)).toBeTruthy()
  })
  it(`renders the real content when the graphqls are done`, () => {
    const result = renderWithLoadProgress(
      () => <Text>the real content</Text>,
      {}
    )({ error: null, props: {}, retry: () => null })
    expect(React.isValidElement(result)).toBeTruthy()
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const tree = renderWithWrappers_legacy(result)
    expect(extractText(tree.root)).toBe("the real content")
  })
})
