import { GlobalStoreProvider } from "lib/store/GlobalStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { View } from "react-native"
import { useSpace } from "../../hooks"
import { SpacingUnit, Theme } from "../../Theme"

describe("space", () => {
  const SpaceView = ({ name }: { name: SpacingUnit }) => {
    const space = useSpace()
    return <View style={{ marginLeft: space(name as any) }} />
  }

  it("returns the correct space with a Theme provider", () => {
    const TestComponent = () => (
      <GlobalStoreProvider>
        <Theme>
          <SpaceView name={1} />
        </Theme>
      </GlobalStoreProvider>
    )

    const tree = renderWithWrappers(<TestComponent />).root
    expect(tree.findByType(View).props.style.marginLeft).toBe(10)
  })

  it("returns the correct space with a Theme provider in v2", () => {
    const TestComponent = () => (
      <GlobalStoreProvider>
        <Theme theme="v2">
          <>
            <SpaceView name={0.3} />
            <SpaceView name={6} />
          </>
        </Theme>
      </GlobalStoreProvider>
    )
    const tree = renderWithWrappers(<TestComponent />).root
    const margins = tree.findAllByType(View).map((view) => view.props.style.marginLeft)
    expect(margins[0]).toBe(5) // this is because we have v2 merged with v3 by default, so 0.3 maps to 0.5
    expect(margins[1]).toBe(60)
  })

  it("returns the correct space with a Theme provider in v3", () => {
    const TestComponent = () => (
      <GlobalStoreProvider>
        <Theme theme="v3">
          <>
            {/* @ts-ignore */}
            <SpaceView name="0.3" />
            <SpaceView name="2" />
          </>
        </Theme>
      </GlobalStoreProvider>
    )
    const tree = renderWithWrappers(<TestComponent />).root
    const margins = tree.findAllByType(View).map((view) => view.props.style.marginLeft)
    expect(margins[0]).toBe(5) // for now we keep v2 accessible, even in v3
    expect(margins[1]).toBe(20)
  })
})
