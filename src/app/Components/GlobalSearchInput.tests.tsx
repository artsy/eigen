import { GlobalSearchInput } from "app/Components/GlobalSearchInput"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("GlobalSearchInput", () => {
  it("renders the search label properly", () => {
    renderWithWrappers(<GlobalSearchInput />)

    expect(/Search artists, artworks, etc/).toBeTruthy()
  })
})
