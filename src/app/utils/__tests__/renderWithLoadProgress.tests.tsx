import { screen } from "@testing-library/react-native"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text } from "react-native"

describe(renderWithLoadProgress, () => {
  it(`renders a spinner while the graphqls are loading`, () => {
    renderWithWrappers(
      renderWithLoadProgress(() => null, {})({ error: null, props: null, retry: () => null })!
    )

    expect(screen.getByTestId("relay-loading")).toBeTruthy()
  })

  it(`renders the real content when the graphqls are done`, () => {
    renderWithWrappers(
      renderWithLoadProgress(
        () => <Text>the real content</Text>,
        {}
      )({ error: null, props: {}, retry: () => null })!
    )

    expect(screen.getByText("the real content")).toBeTruthy()
  })
})
