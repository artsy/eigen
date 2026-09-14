import { fireEvent, screen } from "@testing-library/react-native"
import { ItineraryCustomStopSheet } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryCustomStopSheet"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const stop: ItineraryStop = {
  id: "stop-1",
  title: "Coffee at London Cafe",
  address: "12 Bermondsey Street",
  category: "GALLERY",
  displayTime: "10am-6pm",
  note: "🥂 🧀",
  imageUrl: "https://example.com/cafe.jpg",
  saveTarget: null,
}

describe("ItineraryCustomStopSheet", () => {
  it("shows everything the stop carries", () => {
    renderWithWrappers(<ItineraryCustomStopSheet stop={stop} onClose={jest.fn()} />)

    expect(screen.getByText("Coffee at London Cafe")).toBeOnTheScreen()
    expect(screen.getByText("12 Bermondsey Street")).toBeOnTheScreen()
    expect(screen.getByText("10am-6pm")).toBeOnTheScreen()
    expect(screen.getByText("🥂 🧀")).toBeOnTheScreen()
    expect(screen.getByTestId("custom-stop-image")).toHaveProp(
      "src",
      "https://example.com/cafe.jpg"
    )
  })

  it("offers the source link only when the stop has one", () => {
    renderWithWrappers(<ItineraryCustomStopSheet stop={stop} onClose={jest.fn()} />)

    expect(screen.queryByTestId("custom-stop-source")).not.toBeOnTheScreen()

    screen.rerender(
      <ItineraryCustomStopSheet
        stop={{ ...stop, sourceURL: "https://timeout.com/london-cafe" }}
        onClose={jest.fn()}
      />
    )

    expect(screen.getByTestId("custom-stop-source")).toBeOnTheScreen()
  })

  it("falls back to a placeholder when the stop has no image", () => {
    renderWithWrappers(
      <ItineraryCustomStopSheet stop={{ ...stop, imageUrl: "" }} onClose={jest.fn()} />
    )

    expect(screen.getByTestId("custom-stop-no-image")).toBeOnTheScreen()
    expect(screen.queryByTestId("custom-stop-image")).not.toBeOnTheScreen()
  })

  it("closes on the close button", () => {
    const onClose = jest.fn()
    renderWithWrappers(<ItineraryCustomStopSheet stop={stop} onClose={onClose} />)

    fireEvent.press(screen.getByTestId("custom-stop-close"))

    expect(onClose).toHaveBeenCalled()
  })

  it("renders nothing without a stop", () => {
    renderWithWrappers(<ItineraryCustomStopSheet stop={null} onClose={jest.fn()} />)

    expect(screen.queryByText("Coffee at London Cafe")).not.toBeOnTheScreen()
  })
})
