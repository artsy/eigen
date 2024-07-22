import { fireEvent, screen } from "@testing-library/react-native"
import { SubmitArtworkAddPhoneNumber } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkAddPhoneNumber"
import { renderWithSubmitArtworkWrapper } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/testWrappers"

describe("SubmitArtworkAddPhoneNumber", () => {
  it("displays the phone number input", () => {
    renderWithSubmitArtworkWrapper({
      component: <SubmitArtworkAddPhoneNumber />,
    })

    const input = screen.getByTestId("phone-input")

    expect(input).toBeOnTheScreen()

    fireEvent.changeText(input, "1234567890")

    expect(input.props.value).toBe("(123) 456-7890")
  })
})
