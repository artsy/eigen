import { fireEvent, screen } from "@testing-library/react-native"
import { CityCuratedGuidesScreen } from "app/Scenes/CityGuide/Screens/CityCuratedGuides"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

jest.mock("@artsy/palette-mobile", () => ({
  ...jest.requireActual("@artsy/palette-mobile"),
  Image: require("react-native").Image,
}))

describe("CityCuratedGuidesScreen", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => <CityCuratedGuidesScreen citySlug="london-united-kingdom" />,
  })
  const guide = (title: string, featured = false, visibility = "PUBLIC") => ({
    id: `relay-${title}`,
    internalID: title,
    slug: title,
    title,
    featured,
    visibility,
    heroImage: null,
  })
  const connection = (nodes: object[], hasNextPage = false) => ({
    ItinerariesConnection: () => ({
      edges: nodes.map((node) => ({ node })),
      pageInfo: { hasNextPage, endCursor: "cursor" },
    }),
  })

  it("tracks a screen view with the city slug", async () => {
    renderWithRelay(connection([guide("Normal")]))
    await screen.findByText("Normal")

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "screen",
      context_screen_owner_type: "cityGuideCuratedGuides",
      context_screen_owner_slug: "london-united-kingdom",
    })
  })

  it("renders every guide as a large card, with featured guides first", async () => {
    renderWithRelay(connection([guide("Normal"), guide("Featured", true), guide("Lead", true)]))

    const cards = await screen.findAllByTestId("event-guide-featured")
    expect(cards).toHaveLength(3)
    expect(cards[0]).toContainElement(screen.getByText("Featured"))
    expect(cards[2]).toContainElement(screen.getByText("Normal"))
    expect(screen.queryByTestId("event-guide-row")).not.toBeOnTheScreen()
  })

  it("renders a lone unfeatured guide as a large card", async () => {
    renderWithRelay(connection([guide("Normal")]))

    expect(await screen.findByTestId("event-guide-featured")).toBeOnTheScreen()
    expect(screen.queryByTestId("event-guide-row")).not.toBeOnTheScreen()
  })

  it("filters unpublished guides and shows an empty state", async () => {
    renderWithRelay(
      connection([guide("Draft", false, "PRIVATE"), guide("Unlisted", false, "UNLISTED")])
    )

    expect(
      await screen.findByText("There are no curated guides for this city yet.")
    ).toBeOnTheScreen()
    expect(screen.queryByText("Draft")).not.toBeOnTheScreen()
    expect(screen.queryByText("Unlisted")).not.toBeOnTheScreen()
  })

  it("opens a guide's itinerary", async () => {
    renderWithRelay(connection([guide("normal-guide")]))

    fireEvent.press(await screen.findByTestId("event-guide-featured"))

    expect(navigate).toHaveBeenCalledWith(
      "/city-guide/london-united-kingdom/itinerary/normal-guide"
    )
  })

  it("loads more guides at the end of the list", async () => {
    const { mockResolveLastOperation } = renderWithRelay(connection([guide("First")], true))
    await screen.findByText("First")

    fireEvent(screen.getByTestId("city-curated-guides-list"), "onEndReached")
    mockResolveLastOperation(connection([guide("Second")]))

    expect(await screen.findByText("Second")).toBeOnTheScreen()
    expect(screen.getByText("First")).toBeOnTheScreen()
  })
})
