import { render } from "@testing-library/react-native"
import { ColoredDot, DEFAULT_DOT_COLOR } from "app/Components/LineGraph/ColoredDot"

describe("ColoredDot", () => {
  it("returns the right color", () => {
    const { getByTestId } = render(<ColoredDot color="#44BBDD" />)
    const dot = getByTestId("colored-dot")
    expect(dot.props.backgroundColor).toEqual("#44BBDD")
  })

  it("falls back to default color when color is not supplied", () => {
    const { getByTestId } = render(<ColoredDot />)
    const dot = getByTestId("colored-dot")
    expect(dot.props.backgroundColor).toEqual(DEFAULT_DOT_COLOR)
  })
})
