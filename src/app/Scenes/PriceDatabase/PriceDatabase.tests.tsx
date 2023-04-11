import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { PriceDatabase } from "./PriceDatabase"

describe(PriceDatabase, () => {
  it("renders the price database", () => {
    const { getByText } = renderWithWrappers(<PriceDatabase />)

    expect(getByText("Price Database")).toBeTruthy()
  })
})
