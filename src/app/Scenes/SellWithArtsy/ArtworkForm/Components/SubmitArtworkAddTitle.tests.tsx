import { fireEvent, screen } from "@testing-library/react-native"
import { SubmitArtworkAddTitle } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkAddTitle"
import { renderWithSubmitArtworkWrapper } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/testWrappers"

describe("SubmitArtworkAddTitle", () => {
  it("shows the artwork input title", () => {
    renderWithSubmitArtworkWrapper({
      component: <SubmitArtworkAddTitle />,
    })

    const input = screen.getByPlaceholderText("Artwork Title")
    expect(input).toBeOnTheScreen()

    fireEvent.changeText(input, "My Artwork Title")

    expect(input.props.value).toBe("My Artwork Title")
  })
})
