import { fireEvent, screen } from "@testing-library/react-native"
import { CityGuideEvents } from "app/Scenes/CityGuide/Components/CityGuideEvents"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("CityGuideEvents", () => {
  const { renderWithRelay } = setupTestWrapper({ Component: CityGuideEvents })
  const props = { citySlug: "london-united-kingdom", cityName: "London" }

  const city = {
    fairsConnection: {
      edges: [
        {
          node: {
            internalID: "fair-1",
            name: "Frieze London",
            profile: { id: "profile-node-1", internalID: "profile-1", isFollowed: false },
            href: "/fair/frieze-london-2025",
            image: { url: "https://example.com/fair.jpg" },
          },
        },
      ],
    },
    currentShows: {
      edges: [
        {
          node: {
            id: "show-node-1",
            internalID: "show-1",
            isFollowed: false,
            name: "One Fly Makes No Summer",
            href: "/show/kristin-hjellegjerde-gallery-one-fly-makes-no-summer",
            exhibitionPeriod: "Jul 31 – Aug 29, 2026",
            isFreeAdmission: true,
            coverImage: { url: "https://example.com/show.jpg" },
          },
        },
      ],
    },
    openingShows: {
      edges: [
        {
          node: {
            id: "opening-node-1",
            internalID: "opening-1",
            isFollowed: false,
            name: "Vestiges",
            href: "/show/annely-juda-fine-art-vestiges",
            opensAt: "Sep 3, 2026",
            coverImage: { url: "https://example.com/opening.jpg" },
          },
        },
      ],
    },
  }

  const resolvers = { City: () => city }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("interpolates the city name into the two Current headers, but not Opening Soon", async () => {
    renderWithRelay(resolvers, props)

    expect(await screen.findByText("Current London Fairs")).toBeOnTheScreen()
    expect(screen.getByText("Current London Shows")).toBeOnTheScreen()
    expect(screen.getByText("Opening Soon")).toBeOnTheScreen()
  })

  it("renders a card in each rail from the query", async () => {
    renderWithRelay(resolvers, props)

    expect(await screen.findByText("Frieze London")).toBeOnTheScreen()
    expect(screen.getByText("One Fly Makes No Summer")).toBeOnTheScreen()
    expect(screen.getByText("Vestiges")).toBeOnTheScreen()
  })

  it("shows the run for a current show and the opening day for one opening soon", async () => {
    renderWithRelay(resolvers, props)

    expect(await screen.findByText("Jul 31 – Aug 29, 2026")).toBeOnTheScreen()
    expect(screen.getByText("Sep 3, 2026")).toBeOnTheScreen()
  })

  it("turns isFreeAdmission into words, and shows no admission line for Opening Soon", async () => {
    renderWithRelay(resolvers, props)

    expect(await screen.findByText("Free")).toBeOnTheScreen()
    expect(screen.queryByText("Paid Entry")).not.toBeOnTheScreen()
  })

  it("says Paid Entry when admission is not free", async () => {
    renderWithRelay(
      {
        City: () => ({
          ...city,
          currentShows: {
            edges: [{ node: { ...city.currentShows.edges[0].node, isFreeAdmission: false } }],
          },
        }),
      },
      props
    )

    expect(await screen.findByText("Paid Entry")).toBeOnTheScreen()
  })

  it("navigates to the show when a card is tapped", async () => {
    renderWithRelay(resolvers, props)

    fireEvent.press(await screen.findByText("One Fly Makes No Summer"))

    expect(navigate).toHaveBeenCalledWith(
      "/show/kristin-hjellegjerde-gallery-one-fly-makes-no-summer"
    )
  })

  it("navigates to the full list when a section header is tapped", async () => {
    renderWithRelay(resolvers, props)

    fireEvent.press(await screen.findByText("Current London Fairs"))

    expect(navigate).toHaveBeenCalledWith("/city-guide/london-united-kingdom/events/fairs")
  })

  it("hides a section that has no results, header included", async () => {
    renderWithRelay(
      {
        City: () => ({
          ...city,
          fairsConnection: { edges: [] },
          openingShows: { edges: [] },
        }),
      },
      props
    )

    // The one section with results still renders...
    expect(await screen.findByText("Current London Shows")).toBeOnTheScreen()
    // ...and the two empty ones are gone entirely, not left as empty rails.
    expect(screen.queryByText("Current London Fairs")).not.toBeOnTheScreen()
    expect(screen.queryByText("Opening Soon")).not.toBeOnTheScreen()
  })

  // No test for "every section empty": the loading fallback also renders nothing, so such a
  // test would pass while still suspended and prove nothing. The case above covers the rule,
  // because the one section that does render shows the query resolved.

  // The save control used to be a bare icon inside the card's RouterLink, so tapping it
  // navigated instead of saving. It is now a sibling of the link, as in CityEventRow.
  it("saves instead of navigating when the save control is tapped", async () => {
    renderWithRelay(resolvers, props)

    fireEvent.press(await screen.findByLabelText("Save One Fly Makes No Summer"))

    expect(navigate).not.toHaveBeenCalled()
  })

  it("still navigates when the card itself is tapped", async () => {
    renderWithRelay(resolvers, props)

    fireEvent.press(await screen.findByText("One Fly Makes No Summer"))

    expect(navigate).toHaveBeenCalledWith(
      "/show/kristin-hjellegjerde-gallery-one-fly-makes-no-summer"
    )
  })

  // The designs size the rails' add glyph at 18; CityGuideSaveButton defaults to the 24 the
  // list rows use, so the rails have to ask for the smaller one.
  it("renders the save glyph at the size the rail designs specify", async () => {
    renderWithRelay(resolvers, props)

    const icons = await screen.findAllByTestId("city-guide-save-button-add-icon")

    expect(icons.length).toBeGreaterThan(0)
    icons.forEach((icon) => {
      expect(icon).toHaveProp("width", 18)
      expect(icon).toHaveProp("height", 18)
    })
  })
})
