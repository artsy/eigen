import { fireEvent, screen } from "@testing-library/react-native"
import { ItineraryListItem } from "app/Scenes/CityGuide/Components/ItineraryListItem"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text } from "react-native"

describe("ItineraryListItem", () => {
  const props = {
    title: "London Oct 2026",
    stopsCount: 16,
    imageUrl: "https://example.com/hero.jpg",
    href: "/city-guide/london-united-kingdom/itinerary/abc",
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the name and the stop count", () => {
    renderWithWrappers(<ItineraryListItem {...props} />)

    expect(screen.getByText("London Oct 2026")).toBeOnTheScreen()
    expect(screen.getByText("16 stops")).toBeOnTheScreen()
  })

  it("says one stop rather than 1 stops", () => {
    renderWithWrappers(<ItineraryListItem {...props} stopsCount={1} />)

    expect(screen.getByText("1 stop")).toBeOnTheScreen()
  })

  it("navigates to the itinerary when tapped", () => {
    renderWithWrappers(<ItineraryListItem {...props} />)

    fireEvent.press(screen.getByText("London Oct 2026"))

    expect(navigate).toHaveBeenCalledWith("/city-guide/london-united-kingdom/itinerary/abc")
  })

  it("renders a right slot when given one", () => {
    renderWithWrappers(<ItineraryListItem {...props} rightSlot={<Text>share</Text>} />)

    expect(screen.getByText("share")).toBeOnTheScreen()
  })

  // The rail's cards round their image's left corners so it meets the card edge; the list
  // screen's rows are square.
  it("rounds the image's left corners only as a card", () => {
    renderWithWrappers(<ItineraryListItem {...props} variant="card" />)

    expect(screen.getByTestId("itinerary-list-item-image")).toHaveStyle({
      borderTopLeftRadius: 8,
      borderBottomLeftRadius: 8,
    })

    screen.unmount()
    renderWithWrappers(<ItineraryListItem {...props} />)

    expect(screen.getByTestId("itinerary-list-item-image")).toHaveStyle({
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    })
  })
})
