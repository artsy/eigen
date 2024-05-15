import { fireEvent, screen } from "@testing-library/react-native"
import { SubmitArtworkAddProvenance } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkAddProvenance"
import { renderWithSubmitArtworkWrapper } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/testWrappers"

describe("SubmitArtworkAddProvenance", () => {
  it("shows and updates properly the provenance", async () => {
    renderWithSubmitArtworkWrapper({
      component: <SubmitArtworkAddProvenance />,
    })

    const input = screen.getByTestId("Submission_ProvenanceInput")
    expect(input).toBeOnTheScreen()

    fireEvent.changeText(input, "My Artwork Provenance")

    expect(input.props.value).toBe("My Artwork Provenance")
  })
})
