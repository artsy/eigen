import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { Text } from "react-native"
import renderWithLoadProgress from "./renderWithLoadProgress"

describe(renderWithLoadProgress, () => {
  it(`renders a spinner while the graphqls are loading`, () => {
    const { getByTestId } = renderWithWrappersTL(
      renderWithLoadProgress(() => null, {})({ error: null, props: null, retry: () => null })!
    )

    expect(getByTestId("relay-loading")).toBeTruthy()
  })

  it(`renders the real content when the graphqls are done`, () => {
    const { getByText } = renderWithWrappersTL(
      renderWithLoadProgress(
        () => <Text>the real content</Text>,
        {}
      )({ error: null, props: {}, retry: () => null })!
    )

    expect(getByText("the real content")).toBeTruthy()
  })
})
