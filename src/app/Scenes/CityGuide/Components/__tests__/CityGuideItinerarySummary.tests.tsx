import { fireEvent, screen } from "@testing-library/react-native"
import { CityGuideItinerarySummary } from "app/Scenes/CityGuide/Components/CityGuideItinerarySummary"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("CityGuideItinerarySummary", () => {
  const { renderWithRelay } = setupTestWrapper({ Component: CityGuideItinerarySummary })
  const props = { citySlug: "london-united-kingdom", cityName: "London" }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const resolvers = (showNames: string[], fairs: { name: string; isFollowed: boolean }[] = []) => ({
    FollowsAndSaves: () => ({
      shows: { edges: showNames.map((name) => ({ node: { name } })) },
    }),
    City: () => ({
      fairsConnection: {
        edges: fairs.map(({ name, isFollowed }) => ({ node: { name, profile: { isFollowed } } })),
      },
    }),
  })

  it("counts saved shows", async () => {
    const showNames = ["Frida Kahlo", "Tracey Emin", "Cecily Brown"]

    renderWithRelay(resolvers(showNames), props)

    expect(await screen.findByText("Your London Itinerary")).toBeTruthy()
    expect(screen.getByText(`${showNames.length} Stops`)).toBeTruthy()
  })

  it("counts followed fairs alongside shows", async () => {
    const showNames = ["Frida Kahlo"]
    const fairs = [
      { name: "Frieze London", isFollowed: true },
      { name: "Photo London", isFollowed: false },
    ]
    const expected = showNames.length + fairs.filter((f) => f.isFollowed).length

    renderWithRelay(resolvers(showNames, fairs), props)

    expect(await screen.findByText(`${expected} Stops`)).toBeTruthy()
  })

  it("renders nothing when the user has saved nothing", () => {
    renderWithRelay(resolvers([]), props)

    expect(screen.queryByText("Your London Itinerary")).toBeNull()
  })

  it("marks the count as a lower bound when the show page comes back full", async () => {
    const showNames = Array.from({ length: 100 }, (_, i) => `Show ${i}`)

    renderWithRelay(resolvers(showNames), props)

    expect(await screen.findByText("100+ Stops")).toBeTruthy()
  })

  it("opens the itinerary screen when pressed", async () => {
    const showNames = ["Frida Kahlo"]

    renderWithRelay(resolvers(showNames), props)
    fireEvent.press(await screen.findByTestId("city-guide-event-summary-row"))

    // Task 10's review found its navigation was untested AND unverifiable by hand, because the
    // simulator could not scroll to the rows. Do not repeat that here. `navigate` is globally
    // mocked as a jest.fn() in `setupJest.tsx:631`, so import it and assert on it.
    expect(navigate).toHaveBeenCalledWith("/city-save/london-united-kingdom")
  })

  it("tracks the tap", async () => {
    const showNames = ["Frida Kahlo"]

    renderWithRelay(resolvers(showNames), props)
    fireEvent.press(await screen.findByTestId("city-guide-event-summary-row"))

    expect(mockTrackEvent).toHaveBeenCalled()
  })
})
