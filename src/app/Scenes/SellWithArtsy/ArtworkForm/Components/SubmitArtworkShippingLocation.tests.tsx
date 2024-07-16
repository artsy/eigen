import { fireEvent, screen } from "@testing-library/react-native"
import { COUNTRY_SELECT_OPTIONS } from "app/Components/CountrySelect"
import { SubmitArtworkShippingLocation } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkShippingLocation"
import { renderWithSubmitArtworkWrapper } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/testWrappers"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"

describe("SubmitArtworkShippingLocation", () => {
  it("shows and updates properly the shipping location information", async () => {
    renderWithSubmitArtworkWrapper({
      component: <SubmitArtworkShippingLocation />,
    })

    const countrySelect = screen.getByTestId("country-select")
    expect(countrySelect).toBeOnTheScreen()

    fireEvent.press(countrySelect)
    // Wait for the select modal to show up
    await flushPromiseQueue()

    fireEvent.press(screen.getByText(COUNTRY_SELECT_OPTIONS[0].label as string))

    expect(screen.getAllByText(COUNTRY_SELECT_OPTIONS[0].label as string)).toHaveLength(2)

    expect(screen.getByText("Address Line 1")).toBeOnTheScreen()

    expect(screen.getByText("Address Line 2")).toBeOnTheScreen()

    expect(screen.getByText("City")).toBeOnTheScreen()

    expect(screen.getByText("Postal Code")).toBeOnTheScreen()

    expect(screen.getByText("State, Province, or Region")).toBeOnTheScreen()
  })
})
