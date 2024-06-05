import { fireEvent, screen } from "@testing-library/react-native"
import { SubmitArtworkAddDetails } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkAddDetails"
import { renderWithSubmitArtworkWrapper } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/testWrappers"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"

describe("SubmitArtworkAddDetails", () => {
  it("Shows and updates the artwork details properly", async () => {
    renderWithSubmitArtworkWrapper({
      component: <SubmitArtworkAddDetails />,
    })

    const yearInput = screen.getByTestId("Submission_YearInput")
    expect(yearInput).toBeOnTheScreen()
    fireEvent.changeText(yearInput, "2024")
    expect(yearInput.props.value).toBe("2024")

    const mediumPicker = screen.getByTestId("CategorySelect")
    fireEvent.press(mediumPicker)
    // Wait for the select modal to show up
    await flushPromiseQueue()
    fireEvent.press(screen.getByText("Painting"))

    const materialsInput = screen.getByTestId("Submission_MaterialsInput")
    expect(materialsInput).toBeOnTheScreen()
    fireEvent.changeText(materialsInput, "Whatever")
    expect(materialsInput.props.value).toBe("Whatever")
  })
})
