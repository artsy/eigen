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
    expect(mediumPicker).toBeOnTheScreen()
    fireEvent.press(mediumPicker)
    // Wait for the select modal to show up
    await flushPromiseQueue()
    fireEvent.press(screen.getByText("Painting"))
    // Wait for the select modal to dismiss
    await flushPromiseQueue()
    expect(screen.getByText("Painting")).toBeOnTheScreen()

    const rarityPicker = screen.getByTestId("Submission_RaritySelect")
    expect(rarityPicker).toBeOnTheScreen()
    fireEvent.press(rarityPicker)
    // Wait for the select modal to show up
    await flushPromiseQueue()
    fireEvent.press(screen.getByText("Unique"))
    // Wait for the select modal to dismiss
    await flushPromiseQueue()
    expect(screen.getByText("Unique")).toBeOnTheScreen()
  })

  describe("Year input", () => {
    it("Hides input when the user taps on I don't know", async () => {
      renderWithSubmitArtworkWrapper({
        component: <SubmitArtworkAddDetails />,
      })

      const yearInput = screen.getByTestId("Submission_YearInput")
      fireEvent.changeText(yearInput, "2024")
      expect(yearInput.props.value).toBe("2024")

      const iDontKnowButton = screen.getByText("I don't know")
      fireEvent.press(iDontKnowButton)
      await flushPromiseQueue()
      expect(yearInput.props.value).toBe("")
    })

    it("Injects the previous value after deselecting I don't know", async () => {
      renderWithSubmitArtworkWrapper({
        component: <SubmitArtworkAddDetails />,
      })

      const yearInput = screen.getByTestId("Submission_YearInput")
      fireEvent.changeText(yearInput, "2024")
      expect(yearInput.props.value).toBe("2024")

      const iDontKnowButton = screen.getByText("I don't know")
      fireEvent.press(iDontKnowButton)
      await flushPromiseQueue()
      expect(yearInput.props.value).toBe("")

      fireEvent.press(iDontKnowButton)
      await flushPromiseQueue()
      expect(yearInput.props.value).toBe("2024")
    })
  })
})
