import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { View } from "react-native"
import { useSpace } from "../hooks"
import { SpacingUnit } from "../Theme"

describe("space", () => {
  const SpaceView = ({ name }: { name: SpacingUnit }) => {
    const space = useSpace()
    return <View style={{ marginLeft: space(name as any) }} />
  }

  it("returns the correct space with a Theme provider", () => {
    const TestComponent = () => <SpaceView name={1} />

    const tree = renderWithWrappers(<TestComponent />).root
    expect(tree.findByType(View).props.style.marginLeft).toBe(10)
  })

  it("returns the correct space with a Theme provider in v3", () => {
    const TestComponent = () => (
      <>
        {/* @ts-ignore */}
        <SpaceView name="0.3" />
        <SpaceView name="2" />
      </>
    )
    const tree = renderWithWrappers(<TestComponent />).root
    const margins = tree.findAllByType(View).map((view) => view.props.style.marginLeft)
    expect(margins[0]).toBe(5) // for now we keep v2 accessible, even in v3
    expect(margins[1]).toBe(20)
  })
})
