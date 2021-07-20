import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { View } from "react-native"
import { Color, Theme, useColor } from "../../Theme"

describe("color", () => {
  const ColorView = ({ name }: { name: Color }) => {
    const color = useColor()
    return <View style={{ backgroundColor: color(name as any) }} />
  }

  it("returns the correct color with a Theme provider", () => {
    const TestComponent = () => (
      <Theme>
        <ColorView name="black10" />
      </Theme>
    )

    const tree = renderWithWrappers(<TestComponent />).root
    expect(tree.findByType(View).props.style.backgroundColor).toBe("#E5E5E5")
  })

  it("returns the correct color with a Theme provider in v2", () => {
    const TestComponent = () => (
      <Theme theme="v2">
        <>
          <ColorView name="yellow30" />
          <ColorView name="copper100" />
        </>
      </Theme>
    )
    const tree = renderWithWrappers(<TestComponent />).root
    const bgColors = tree.findAllByType(View).map((view) => view.props.style.backgroundColor)
    expect(bgColors[0]).toBe("#FAE7BA")
    expect(bgColors[1]).toBe("#A85F00")
  })

  it("returns the correct color with a Theme provider in v3", () => {
    const TestComponent = () => (
      <Theme theme="v3">
        <>
          <ColorView name="yellow30" />
          <ColorView name="copper100" />
        </>
      </Theme>
    )
    const tree = renderWithWrappers(<TestComponent />).root
    const bgColors = tree.findAllByType(View).map((view) => view.props.style.backgroundColor)
    expect(bgColors[0]).toBe(undefined)
    expect(bgColors[1]).toBe("#7B5927")
  })

  it("returns the correct color with a Theme provider with override", () => {
    const TestComponent = () => (
      <Theme theme="v3" override={{ colors: { yellow30: "red", copper100: "blue" } }}>
        <>
          <ColorView name="yellow30" />
          <ColorView name="copper100" />
        </>
      </Theme>
    )
    const tree = renderWithWrappers(<TestComponent />).root
    const bgColors = tree.findAllByType(View).map((view) => view.props.style.backgroundColor)
    expect(bgColors[0]).toBe("red")
    expect(bgColors[1]).toBe("blue")
  })

  it("returns the correct color with nested Theme providers", () => {
    const TestComponent = () => (
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
    )
    const tree = renderWithWrappers(<TestComponent />).root
    const bgColors = tree.findAllByType(View).map((view) => view.props.style.backgroundColor)
    expect(bgColors[0]).toBe("red")
    expect(bgColors[1]).toBe("blue")
    expect(bgColors[2]).toBe("green")
    expect(bgColors[3]).toBe("purple")
  })
})
