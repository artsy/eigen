import { fireEvent, screen } from "@testing-library/react-native"
import { ItineraryListItem } from "app/Scenes/CityGuide/Components/ItineraryListItem"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text } from "react-native"

// React-test-renderer has issues with memo components, so we need to mock the palette-mobile
// Image component. See https://github.com/facebook/react/issues/17301
jest.mock("@artsy/palette-mobile", () => ({
  ...jest.requireActual("@artsy/palette-mobile"),
  Image: require("react-native").Image,
}))

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

  it("fires onPress before navigating", () => {
    const onPress = jest.fn()
    renderWithWrappers(<ItineraryListItem {...props} onPress={onPress} />)

    fireEvent.press(screen.getByText("London Oct 2026"))

    expect(onPress).toHaveBeenCalled()
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

  // RNTL performs no layout, so the guard is that a width is declared at all.
  it("gives the card an explicit width rather than relying on flex", () => {
    renderWithWrappers(<ItineraryListItem {...props} variant="card" />)

    expect(screen.getByTestId("itinerary-list-item")).toHaveStyle({ width: 240 })
  })

  it("renders the title and count as a card, not just the image", () => {
    renderWithWrappers(<ItineraryListItem {...props} variant="card" />)

    expect(screen.getByText("London Oct 2026")).toBeOnTheScreen()
    expect(screen.getByText("16 stops")).toBeOnTheScreen()
  })

  // Both the row and the card show a placeholder instead of an empty box.
  it("shows a placeholder for a row with no image", () => {
    renderWithWrappers(<ItineraryListItem {...props} imageUrl={null} />)

    expect(screen.getByText("London Oct 2026")).toBeOnTheScreen()
    expect(screen.queryByTestId("itinerary-list-item-image")).not.toBeOnTheScreen()
    expect(screen.getByTestId("itinerary-list-item-no-image")).toBeOnTheScreen()
  })

  it("shows a placeholder for a card with no image", () => {
    renderWithWrappers(<ItineraryListItem {...props} variant="card" imageUrl={null} />)

    expect(screen.getByTestId("itinerary-list-item-no-image")).toBeOnTheScreen()
    expect(screen.queryByTestId("itinerary-list-item-image")).not.toBeOnTheScreen()
  })

  it("shows the image when there is one", () => {
    renderWithWrappers(<ItineraryListItem {...props} />)

    expect(screen.getByTestId("itinerary-list-item-image")).toBeOnTheScreen()
  })
})
