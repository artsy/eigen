import { render } from "@testing-library/react-native"
import { ColoredDot, DEFAULT_DOT_COLOR } from "./ColoredDot"
import { getRandomColor } from "./helpers"

describe("ColoredDot", () => {
  it("returns the right color", () => {
    const { getByTestId } = render(<ColoredDot color="#44BBDD" />)
    const dot = getByTestId("colored-dot")
    expect(dot.props.backgroundColor).toEqual("#44BBDD")
  })

  it("falls back to default color when disabled", () => {
    const { getByTestId } = render(<ColoredDot color="#44BBDD" disabled />)
    const dot = getByTestId("colored-dot")
    expect(dot.props.backgroundColor).toEqual(DEFAULT_DOT_COLOR)
  })
})

describe(getRandomColor, () => {
  it("returns a valid random number", () => {
    const validColorRegExp = /^#([0-9a-f]{3}){1,2}$/i
    // Run the test 100 times to make sure it's still valid
    // PS: There is no number big enough to validate this, but this is good enough for now 😄
    for (let i = 0; i < 1000; i++) {
      expect(validColorRegExp.test(getRandomColor())).toBeTruthy()
    }
  })
})
