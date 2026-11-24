import { screen } from "@testing-library/react-native"
import { Header } from "app/Scenes/Artwork/Components/OtherWorks/Header"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("ArtworkAvailability", () => {
  it("renders artwork availability correctly", async () => {
    await renderWithWrappers(<Header title="This Is A Test" />)

    expect(screen.getByText("This Is A Test")).toBeTruthy()
  })
})
