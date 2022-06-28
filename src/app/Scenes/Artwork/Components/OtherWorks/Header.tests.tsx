import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { Header } from "./Header"

describe("ArtworkAvailability", () => {
  it("renders artwork availability correctly", () => {
    const { queryByText } = renderWithWrappersTL(<Header title="This Is A Test" />)

    expect(queryByText("This Is A Test")).toBeTruthy()
  })
})
