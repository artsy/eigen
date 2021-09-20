import { GlobalStoreProvider } from "lib/store/GlobalStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { View } from "react-native"
import { _test_THEMES, Color, Theme, useTheme } from "../../Theme"

describe("color", () => {
  const ColorView = ({ name }: { name: Color }) => {
    const { color } = useTheme()
    return <View style={{ backgroundColor: color(name as any) }} />
  }

  it("returns the correct color with a Theme provider", () => {
    const TestComponent = () => (
      <GlobalStoreProvider>
        <Theme>
          <ColorView name="black10" />
        </Theme>
      </GlobalStoreProvider>
    )

    const tree = renderWithWrappers(<TestComponent />).root
    expect(tree.findByType(View).props.style.backgroundColor).toBe(_test_THEMES.v3.colors.black10)
  })

  it("returns the correct color with a Theme provider in v3", () => {
    const TestComponent = () => (
      <GlobalStoreProvider>
        <Theme theme="v3">
          <>
            <ColorView name="yellow30" />
            <ColorView name="copper100" />
          </>
        </Theme>
      </GlobalStoreProvider>
    )
    const tree = renderWithWrappers(<TestComponent />).root
    const bgColors = tree.findAllByType(View).map((view) => view.props.style.backgroundColor)
    expect(bgColors[0]).toBe(_test_THEMES.v2.colors.yellow30) // for now we keep v2 accessible, even in v3.
    expect(bgColors[1]).toBe(_test_THEMES.v3.colors.copper100)
  })
})
