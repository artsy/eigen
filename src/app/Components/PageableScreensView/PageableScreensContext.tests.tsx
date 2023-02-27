import { Text } from "@artsy/palette-mobile"
import {
  PageableScreensContext,
  usePageableScreensContext,
} from "app/Components/PageableScreensView/PageableScreensContext"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("PageableScreensContext", () => {
  const screens = [
    { name: "screen1", Component: <Text>Screen 1</Text> },
    { name: "screen2", Component: <Text>Screen 2</Text> },
  ]

  it("yields the correct context values on render", (done) => {
    const HookToTest = () => {
      const { activeScreen, activeScreenIndex } = usePageableScreensContext()

      expect(activeScreen).toEqual(screens[1])
      expect(activeScreenIndex).toEqual(1)
      done()

      return null
    }

    renderWithWrappers(
      <PageableScreensContext.Provider value={{ activeScreen: screens[1], activeScreenIndex: 1 }}>
        <HookToTest />
      </PageableScreensContext.Provider>
    )
  })
})
