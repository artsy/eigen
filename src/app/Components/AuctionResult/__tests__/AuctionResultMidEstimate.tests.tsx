import { THEMES } from "@artsy/palette-mobile"
import { screen } from "@testing-library/react-native"
import { AuctionResultsMidEstimate } from "app/Components/AuctionResult/AuctionResultMidEstimate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

// tests render with the light theme
const { green100: GREEN_100, red100: RED_100, mono60: MONO_60 } = THEMES.v3light.colors

describe("AuctionResultMidEstimate", () => {
  it("renders the short description", async () => {
    await renderWithWrappers(
      <AuctionResultsMidEstimate value="25%" shortDescription="short description" />
    )
    expect(screen.getByText(/short description/)).toBeOnTheScreen()
  })

  it("renders properly when the percentage is greater than 5", async () => {
    await renderWithWrappers(<AuctionResultsMidEstimate value="25%" />)
    expect(screen.getByText("(+25%)")).toHaveStyle({ color: GREEN_100 })
  })

  it("renders properly when the percentage is less than -5", async () => {
    await renderWithWrappers(<AuctionResultsMidEstimate value="-25%" />)
    expect(screen.getByText("(-25%)")).toHaveStyle({ color: RED_100 })
  })

  it("renders properly when the percentage is between -5 and 5", async () => {
    await renderWithWrappers(<AuctionResultsMidEstimate value="2%" />)
    expect(screen.getByText("(+2%)")).toHaveStyle({ color: MONO_60 })

    await renderWithWrappers(<AuctionResultsMidEstimate value="-2%" />)
    expect(screen.getByText("(-2%)")).toHaveStyle({ color: MONO_60 })
  })
})
