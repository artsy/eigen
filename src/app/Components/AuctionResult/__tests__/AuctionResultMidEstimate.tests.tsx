import { screen } from "@testing-library/react-native"
import { AuctionResultsMidEstimate } from "app/Components/AuctionResult/AuctionResultMidEstimate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

// palette colors
const GREEN_100 = "#00674A"
const RED_100 = "#D71023"
const MONO_60 = "#707070"

describe("AuctionResultMidEstimate", () => {
  it("renders the short description", () => {
    renderWithWrappers(
      <AuctionResultsMidEstimate value="25%" shortDescription="short description" />
    )
    expect(screen.getByText(/short description/)).toBeOnTheScreen()
  })

  it("renders properly when the percentage is greater than 5", () => {
    renderWithWrappers(<AuctionResultsMidEstimate value="25%" />)
    expect(screen.getByText("(+25%)")).toHaveStyle({ color: GREEN_100 })
  })

  it("renders properly when the percentage is less than -5", () => {
    renderWithWrappers(<AuctionResultsMidEstimate value="-25%" />)
    expect(screen.getByText("(-25%)")).toHaveStyle({ color: RED_100 })
  })

  it("renders properly when the percentage is between -5 and 5", () => {
    renderWithWrappers(<AuctionResultsMidEstimate value="2%" />)
    expect(screen.getByText("(+2%)")).toHaveStyle({ color: MONO_60 })

    renderWithWrappers(<AuctionResultsMidEstimate value="-2%" />)
    expect(screen.getByText("(-2%)")).toHaveStyle({ color: MONO_60 })
  })
})
