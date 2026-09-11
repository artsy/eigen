import { fireEvent, screen } from "@testing-library/react-native"
import { CityGuideEventSummaryRow } from "app/Scenes/CityGuide/Components/CityGuideEventSummaryRow"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("CityGuideEventSummaryRow", () => {
  const props = {
    title: "Current Fairs",
    count: 5,
    countLabel: "Fair",
    subtitle: "Frieze London, 1-54, Photo London",
    imageURL: "https://example.com/a.jpg",
    href: "/city-guide/london-united-kingdom/events/fairs",
    onPress: jest.fn(),
  }

  it("renders the title, the pluralised count and the subtitle", () => {
    renderWithWrappers(<CityGuideEventSummaryRow {...props} />)

    expect(screen.getByText("Current Fairs")).toBeTruthy()
    expect(screen.getByText("5 Fairs")).toBeTruthy()
    expect(screen.getByText("Frieze London, 1-54, Photo London")).toBeTruthy()
  })

  it("does not pluralise a count of one", () => {
    renderWithWrappers(<CityGuideEventSummaryRow {...props} count={1} />)

    expect(screen.getByText("1 Fair")).toBeTruthy()
  })

  it("renders without a subtitle", () => {
    renderWithWrappers(<CityGuideEventSummaryRow {...props} subtitle={null} />)

    expect(screen.getByText("5 Fairs")).toBeTruthy()
  })

  it("renders emptyText instead of a zero count", () => {
    // Load-bearing, not cosmetic: a production measurement on 2026-08-27 found London had zero
    // current fairs, so without this the home renders "0 Fairs" over a dead row.
    renderWithWrappers(
      <CityGuideEventSummaryRow {...props} count={0} emptyText="No fairs open right now" />
    )

    expect(screen.getByText("No fairs open right now")).toBeTruthy()
    expect(screen.queryByText("0 Fairs")).toBeNull()
  })

  it("renders the empty-state copy in mono60", () => {
    renderWithWrappers(
      <CityGuideEventSummaryRow {...props} count={0} emptyText="No fairs open right now" />
    )

    expect(screen.getByText("No fairs open right now")).toHaveStyle({ color: "#707070" })
  })

  it("falls back to the count line when the count is zero and no emptyText is given", () => {
    renderWithWrappers(<CityGuideEventSummaryRow {...props} count={0} />)

    expect(screen.getByText("0 Fairs")).toBeTruthy()
  })

  it("appends a count suffix when given one", () => {
    renderWithWrappers(<CityGuideEventSummaryRow {...props} count={100} countSuffix="+" />)

    expect(screen.getByText("100+ Fairs")).toBeTruthy()
  })

  it("renders no suffix when none is given", () => {
    renderWithWrappers(<CityGuideEventSummaryRow {...props} count={5} />)

    expect(screen.getByText("5 Fairs")).toBeTruthy()
  })

  it("calls onPress when the row is pressed", () => {
    const onPress = jest.fn()

    renderWithWrappers(<CityGuideEventSummaryRow {...props} onPress={onPress} />)
    fireEvent.press(screen.getByTestId("city-guide-event-summary-row"))

    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
