import { screen } from "@testing-library/react-native"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text } from "react-native"

describe(renderWithPlaceholder, () => {
  it(`renders the placeholder while the graphqls are loading`, () => {
    renderWithWrappers(
      renderWithPlaceholder({
        Container: () => null,
        renderPlaceholder: () => <Text>this is the placeholder</Text>,
      })({ error: null, props: null, retry: () => null })!
    )

    expect(screen.getByText("this is the placeholder")).toBeTruthy()
  })

  it(`renders the real content when the graphqls are done`, () => {
    renderWithWrappers(
      renderWithPlaceholder({
        Container: () => <Text>the real content</Text>,
        renderPlaceholder: () => <Text>this is the placeholder</Text>,
      })({ error: null, props: {}, retry: () => null })!
    )

    expect(screen.getByText("the real content")).toBeTruthy()
  })
})
