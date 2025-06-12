import { screen } from "@testing-library/react-native"
import { PaginationDots } from "app/Components/PaginationDots"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("PaginationDots", () => {
  it("renders the correct number of dots", () => {
    renderWithWrappers(<PaginationDots currentIndex={0} length={5} />)

    // Each dot has an accessibility label
    const dots = screen.getAllByLabelText("Image Pagination Indicator")
    expect(dots).toHaveLength(5)
  })

  it("renders no dots when length is 0", () => {
    renderWithWrappers(<PaginationDots currentIndex={0} length={0} />)

    const dots = screen.queryAllByLabelText("Image Pagination Indicator")
    expect(dots).toHaveLength(0)
  })
})
