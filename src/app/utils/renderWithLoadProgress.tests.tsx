import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { Text } from "react-native"
import renderWithLoadProgress from "./renderWithLoadProgress"

describe(renderWithLoadProgress, () => {
  it(`renders a spinner while the graphqls are loading`, () => {
    const { getByTestId } = renderWithWrappers(
      renderWithLoadProgress(() => null, {})({ error: null, props: null, retry: () => null })!
    )

    expect(getByTestId("relay-loading")).toBeTruthy()
  })

  it(`renders the real content when the graphqls are done`, () => {
    const { getByText } = renderWithWrappers(
      renderWithLoadProgress(
        () => <Text>the real content</Text>,
        {}
      )({ error: null, props: {}, retry: () => null })!
    )

    expect(getByText("the real content")).toBeTruthy()
  })
})
