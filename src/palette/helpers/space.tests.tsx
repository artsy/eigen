import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { SpacingUnit } from "palette/Theme"
import { useSpace } from "palette/hooks"
import { View } from "react-native"

describe("space", () => {
  const SpaceView = ({ name }: { name: SpacingUnit }) => {
    const space = useSpace()
    return <View style={{ marginLeft: space(name as any) }} />
  }

  it("returns the correct space with a Theme provider", () => {
    const TestComponent = () => <SpaceView name={1} />

    const tree = renderWithWrappersLEGACY(<TestComponent />).root
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
    const tree = renderWithWrappersLEGACY(<TestComponent />).root
    const margins = tree.findAllByType(View).map((view) => view.props.style.marginLeft)
    expect(margins[0]).toBe(5) // for now we keep v2 accessible, even in v3
    expect(margins[1]).toBe(20)
  })
})
