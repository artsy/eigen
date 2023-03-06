import { Text } from "@artsy/palette-mobile"
import { PageableLazyScreen } from "app/Components/PageableScreensView/PageableLazyScreen"
import { PageableScreensView } from "app/Components/PageableScreensView/PageableScreensView"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("PageableScreensView", () => {
  const screens = [
    {
      name: "screen1",
      Component: <Text>Screen 1</Text>,
    },
    {
      name: "screen2",
      Component: <Text>Screen 2</Text>,
    },
  ]

  it("renders correctly", () => {
    const tree = renderWithWrappers(<PageableScreensView screens={screens} />)
    expect(tree.UNSAFE_getAllByType(PageableScreensView)).toHaveLength(1)
    expect(tree.UNSAFE_getAllByType(PageableLazyScreen)).toHaveLength(2)
  })

  it("renders the first screen by default", () => {
    const tree = renderWithWrappers(
      <PageableScreensView screens={screens} prefetchScreensCount={0} />
    )
    expect(tree.queryByText("Screen 1")).toBeDefined()
    expect(tree.queryByText("Screen 2")).toBeNull()
  })

  it("prefetches and renders multiple screens", () => {
    const tree = renderWithWrappers(
      <PageableScreensView screens={screens} prefetchScreensCount={2} />
    )
    expect(tree.queryByText("Screen 1")).toBeDefined()
    expect(tree.queryByText("Screen 2")).toBeDefined()
    expect(tree.queryByText("Screen 3")).toBeDefined()
  })

  it("jumps to specific screens on render", () => {
    const tree = renderWithWrappers(
      <PageableScreensView screens={screens} prefetchScreensCount={0} initialScreenName="screen2" />
    )
    expect(tree.queryByText("Screen 1")).toBeNull()
    expect(tree.queryByText("Screen 2")).toBeDefined()
    expect(tree.queryByText("Screen 3")).toBeNull()
  })
})
