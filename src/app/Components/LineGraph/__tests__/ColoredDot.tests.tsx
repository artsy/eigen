import { render, screen } from "@testing-library/react-native"
import { ColoredDot, DEFAULT_DOT_COLOR } from "app/Components/LineGraph/ColoredDot"

describe("ColoredDot", () => {
  it("returns the right color", async () => {
    await render(<ColoredDot color="#44BBDD" />)
    const dot = screen.getByTestId("colored-dot")
    expect(dot.props.backgroundColor).toEqual("#44BBDD")
  })

  it("falls back to default color when color is not supplied", async () => {
    await render(<ColoredDot />)
    const dot = screen.getByTestId("colored-dot")
    expect(dot.props.backgroundColor).toEqual(DEFAULT_DOT_COLOR)
  })
})
