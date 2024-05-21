import { fireEvent, screen } from "@testing-library/react-native"
import { SubmitArtworkPurchaseHistory } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkPurchaseHistory"
import { renderWithSubmitArtworkWrapper } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/testWrappers"

describe("SubmitArtworkPurchaseHistory", () => {
  it("shows and updates properly the provenance", () => {
    renderWithSubmitArtworkWrapper({
      component: <SubmitArtworkPurchaseHistory />,
    })

    const input = screen.getByTestId("Submission_ProvenanceInput")
    expect(input).toBeOnTheScreen()

    fireEvent.changeText(input, "My Artwork Provenance")

    expect(input.props.value).toBe("My Artwork Provenance")
  })
})
