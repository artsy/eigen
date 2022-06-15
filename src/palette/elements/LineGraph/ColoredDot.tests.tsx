import { render } from "@testing-library/react-native"
import { ALL_COLOR, ColoredDot, getRandomColor, mediumToColor } from "./ColoredDot"

describe("ColoredDot", () => {
  it("returns the right color when a medium with predefined color is selected", () => {
    const { getByTestId } = render(<ColoredDot selectedMedium="Painting" />)
    const dot = getByTestId("colored-dot")
    expect(dot.props.backgroundColor).toEqual(mediumToColor.Painting)
  })

  it("returns a random color when a medium with no predefined color is selected", () => {
    const { getByTestId } = render(<ColoredDot selectedMedium="Installation" />)
    const dot = getByTestId("colored-dot")
    expect(dot.props.backgroundColor).toBeDefined()
  })

  it("returns the right color when no medium is selected", () => {
    const { getByTestId } = render(<ColoredDot selectedMedium={null} />)
    const dot = getByTestId("colored-dot")
    expect(dot.props.backgroundColor).toEqual(ALL_COLOR)
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
