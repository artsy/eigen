import { GlobalStoreProvider } from "lib/store/GlobalStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { View } from "react-native"
import { useColor } from "../../hooks"
import { Color, Theme } from "../../Theme"

describe("color", () => {
  const ColorView = ({ name }: { name: Color }) => {
    const color = useColor()
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
    expect(tree.findByType(View).props.style.backgroundColor).toBe("#E5E5E5")
  })

  it("returns the correct color with a Theme provider in v2", () => {
    const TestComponent = () => (
      <GlobalStoreProvider>
        <Theme theme="v2">
          <>
            <ColorView name="yellow30" />
            <ColorView name="copper100" />
          </>
        </Theme>
      </GlobalStoreProvider>
    )
    const tree = renderWithWrappers(<TestComponent />).root
    const bgColors = tree.findAllByType(View).map((view) => view.props.style.backgroundColor)
    expect(bgColors[0]).toBe("#FAE7BA")
    expect(bgColors[1]).toBe("#A85F00")
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
    expect(bgColors[0]).toBe(undefined)
    expect(bgColors[1]).toBe("#7B5927")
  })

  it("returns the correct color with a Theme provider with override", () => {
    const TestComponent = () => (
      <GlobalStoreProvider>
        <Theme theme="v3" override={{ colors: { yellow30: "red", copper100: "blue" } }}>
          <>
            <ColorView name="yellow30" />
            <ColorView name="copper100" />
          </>
        </Theme>
      </GlobalStoreProvider>
    )
    const tree = renderWithWrappers(<TestComponent />).root
    const bgColors = tree.findAllByType(View).map((view) => view.props.style.backgroundColor)
    expect(bgColors[0]).toBe("red")
    expect(bgColors[1]).toBe("blue")
  })

  it("returns the correct color with nested Theme providers", () => {
    const TestComponent = () => (
      <GlobalStoreProvider>
        <Theme theme="v3" override={{ colors: { yellow30: "red", copper100: "blue" } }}>
          <>
            <ColorView name="yellow30" />
            <ColorView name="copper100" />
            <Theme theme="v3" override={{ colors: { yellow30: "green", copper100: "purple" } }}>
              <>
                <ColorView name="yellow30" />
                <ColorView name="copper100" />
              </>
            </Theme>
          </>
        </Theme>
      </GlobalStoreProvider>
    )
    const tree = renderWithWrappers(<TestComponent />).root
    const bgColors = tree.findAllByType(View).map((view) => view.props.style.backgroundColor)
    expect(bgColors[0]).toBe("red")
    expect(bgColors[1]).toBe("blue")
    expect(bgColors[2]).toBe("green")
    expect(bgColors[3]).toBe("purple")
  })
})
