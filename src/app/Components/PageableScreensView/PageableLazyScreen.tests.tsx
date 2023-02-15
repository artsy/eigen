import { waitFor } from "@testing-library/react-native"
import { PageableLazyScreen } from "app/Components/PageableScreensView/PageableLazyScreen"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text } from "palette"

describe("PageableLazyScreen", () => {
  const screen = { name: "screen1", Component: <Text>Screen 1</Text> }

  it("renders fallback on initial render", () => {
    const tree = renderWithWrappers(<PageableLazyScreen screen={screen} shouldRender={false} />)
    expect(tree.queryByText("Screen 1")).toBeNull()
  })

  it("renders page", async () => {
    const tree = renderWithWrappers(<PageableLazyScreen screen={screen} shouldRender />)

    await waitFor(() => {
      expect(tree.queryByText("Screen 1")).toBeDefined()
    })
  })
})
