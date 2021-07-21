import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { View } from "react-native"
import { SpacingUnit, Theme, useSpace } from "../../Theme"

describe("space", () => {
  const SpaceView = ({ name }: { name: SpacingUnit }) => {
    const space = useSpace()
    return <View style={{ marginLeft: space(name as any) }} />
  }

  it("returns the correct space with a Theme provider", () => {
    const TestComponent = () => (
      <Theme>
        <SpaceView name={1} />
      </Theme>
    )

    const tree = renderWithWrappers(<TestComponent />).root
    expect(tree.findByType(View).props.style.marginLeft).toBe("10px")
  })

  it("returns the correct space with a Theme provider in v2", () => {
    const TestComponent = () => (
      <Theme theme="v2">
        <>
          <SpaceView name={0.3} />
          <SpaceView name={6} />
        </>
      </Theme>
    )
    const tree = renderWithWrappers(<TestComponent />).root
    const margins = tree.findAllByType(View).map((view) => view.props.style.marginLeft)
    expect(margins[0]).toBe("3px")
    expect(margins[1]).toBe("60px")
  })

  it("returns the correct space with a Theme provider in v3", () => {
    const TestComponent = () => (
      <Theme theme="v3">
        <>
          {/* @ts-ignore */}
          <SpaceView name="0.3" />
          <SpaceView name="2" />
        </>
      </Theme>
    )
    const tree = renderWithWrappers(<TestComponent />).root
    const margins = tree.findAllByType(View).map((view) => view.props.style.marginLeft)
    expect(margins[0]).toBe(undefined)
    expect(margins[1]).toBe(20)
  })

  it("returns the correct space with a Theme provider with override", () => {
    const TestComponent = () => (
      <Theme theme="v3" override={{ space: { "1": 12 } }}>
        <>
          <SpaceView name="1" />
        </>
      </Theme>
    )
    const tree = renderWithWrappers(<TestComponent />).root
    const margins = tree.findAllByType(View).map((view) => view.props.style.marginLeft)
    expect(margins[0]).toBe(12)
  })
})
