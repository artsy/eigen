import { Header } from "app/Scenes/Artwork/Components/OtherWorks/Header"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("ArtworkAvailability", () => {
  it("renders artwork availability correctly", () => {
    const { queryByText } = renderWithWrappers(<Header title="This Is A Test" />)

    expect(queryByText("This Is A Test")).toBeTruthy()
  })
})
