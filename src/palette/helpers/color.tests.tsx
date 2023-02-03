import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { _test_THEMES, Color, useTheme } from "palette/Theme"
import { View } from "react-native"

describe("color", () => {
  const ColorView = ({ name }: { name: Color }) => {
    const { color } = useTheme()
    return <View style={{ backgroundColor: color(name as any) }} />
  }

  it("returns the correct color with a Theme provider", () => {
    const TestComponent = () => <ColorView name="black10" />

    const tree = renderWithWrappersLEGACY(<TestComponent />).root
    expect(tree.findByType(View).props.style.backgroundColor).toBe(_test_THEMES.v3.colors.black10)
  })

  it("returns the correct color with a Theme provider in v3", () => {
    const TestComponent = () => (
      <>
        <ColorView name="yellow100" />
        <ColorView name="copper100" />
      </>
    )
    const tree = renderWithWrappersLEGACY(<TestComponent />).root
    const bgColors = tree.findAllByType(View).map((view) => view.props.style.backgroundColor)
    expect(bgColors[1]).toBe(_test_THEMES.v3.colors.copper100)
  })
})
