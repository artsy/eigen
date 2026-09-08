import { fireEvent, screen, within } from "@testing-library/react-native"
import { CitySavedListQueryRenderer } from "app/Scenes/CityGuide/Screens/CitySavedList"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

const mockSetOptions = jest.fn()

// `src/setupJest.tsx` already stubs `useNavigation`, but with a fresh `jest.fn()` created on
// every call, so there is no stable reference to assert against from outside. Overriding it
// here the same way `OnboardingMarketingCollection.tests.tsx` does gives the title test a
// `setOptions` mock it can inspect.
jest.mock("@react-navigation/native", () => {
  const { useEffect } = jest.requireActual("react")
  const actualNav = jest.requireActual("@react-navigation/native")

  return {
    ...actualNav,
    // Mirrors `src/setupJest.tsx:144`'s stub rather than replacing it — a bare spread of the
    // real module drops its `useFocusEffect` substitute, which `useBackHandler` needs and
    // which throws outside a navigation container.
    useFocusEffect: useEffect,
    useIsFocused: () => jest.fn(),
    useNavigation: () => ({ setOptions: mockSetOptions }),
  }
})

describe("CitySavedListQueryRenderer", () => {
  const { renderWithRelay } = setupTestWrapper({ Component: CitySavedListQueryRenderer })
  const props = { citySlug: "london-united-kingdom" }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders a row for every saved show", async () => {
    const shows = [{ name: "Frida Kahlo" }, { name: "Tracey Emin" }]

    renderWithRelay(
      {
        FollowsAndSaves: () => ({ shows: { edges: shows.map((node) => ({ node })) } }),
        City: () => ({ name: "London", fairsConnection: { edges: [] } }),
      },
      props
    )

    await screen.findByText("Frida Kahlo")

    expect(screen.getAllByTestId("city-event-row")).toHaveLength(shows.length)
  })

  it("includes followed fairs and excludes unfollowed ones", async () => {
    const fairs = [
      { name: "Frieze London", profile: { isFollowed: true } },
      { name: "Photo London", profile: { isFollowed: false } },
    ]
    const followed = fairs.filter((f) => f.profile.isFollowed)

    renderWithRelay(
      {
        FollowsAndSaves: () => ({ shows: { edges: [] } }),
        City: () => ({
          name: "London",
          fairsConnection: { edges: fairs.map((node) => ({ node })) },
        }),
      },
      props
    )

    await screen.findByText("Frieze London")

    expect(screen.getAllByTestId("city-event-row")).toHaveLength(followed.length)
    expect(screen.getByText("Frieze London")).toBeTruthy()
    expect(screen.queryByText("Photo London")).toBeNull()
  })

  it("puts fairs above shows", async () => {
    renderWithRelay(
      {
        FollowsAndSaves: () => ({ shows: { edges: [{ node: { name: "Frida Kahlo" } }] } }),
        City: () => ({
          name: "London",
          fairsConnection: {
            edges: [{ node: { name: "Frieze London", profile: { isFollowed: true } } }],
          },
        }),
      },
      props
    )

    await screen.findByText("Frieze London")

    const rows = screen.getAllByTestId("city-event-row")
    // Ordering is positional so paginating shows cannot reorder what is already on screen.
    // `within` rather than `toContainElement`: jest-native is not installed in this repo, so
    // that matcher does not exist.
    expect(within(rows[0]).getByText("Frieze London")).toBeTruthy()
  })

  it("asks for a 365-day upcoming window for shows", async () => {
    // Guards the real fix: Gravity defaults RUNNING_AND_UPCOMING to 15 days, which hides a
    // show saved for a trip next month. Asserted on the compiled Relay request, never on the
    // component's source text, and read from the generated artifact because
    // `mockResolveLastOperation` returns void (`setupTestWrapper.tsx:131-137`).
    //
    // The artifact is named after the query, `CitySavedListQuery`, not after the exported
    // const `CitySavedListScreenQuery` (`CitySavedList.tsx:97-98`).
    //
    // Asserts the value, not just the argument name: a prior version of this test checked only
    // that the string "dayThreshold" appeared, which would still pass if the value were
    // reverted to Gravity's 15-day default or typo'd to 356. The exact serialised form
    // (`{"kind":"Literal","name":"dayThreshold","value":365}`) was confirmed against the
    // compiled artifact before writing this assertion.
    const request = require("__generated__/CitySavedListQuery.graphql").default

    expect(JSON.stringify(request)).toContain('"name":"dayThreshold","value":365')
  })

  it("shows an empty state when nothing is saved", async () => {
    renderWithRelay(
      {
        FollowsAndSaves: () => ({ shows: { edges: [] } }),
        City: () => ({ name: "London", fairsConnection: { edges: [] } }),
      },
      props
    )

    await screen.findByText(/haven’t saved/)

    expect(screen.queryAllByTestId("city-event-row")).toHaveLength(0)
  })

  it("sets the itinerary title, with the city name interpolated, on the native header", async () => {
    renderWithRelay(
      {
        FollowsAndSaves: () => ({ shows: { edges: [{ node: { name: "Frida Kahlo" } }] } }),
        City: () => ({ name: "London", fairsConnection: { edges: [] } }),
      },
      props
    )

    await screen.findByText("Frida Kahlo")

    expect(mockSetOptions).toHaveBeenCalledWith({ title: "Your London Itinerary" })
  })

  it("shows a map toggle when there are places to map, and switches list/map mode when pressed", async () => {
    renderWithRelay(
      {
        FollowsAndSaves: () => ({
          shows: {
            edges: [
              {
                node: {
                  name: "Frida Kahlo",
                  location: { coordinates: { lat: 51.5, lng: -0.1 } },
                },
              },
            ],
          },
        }),
        City: () => ({ name: "London", fairsConnection: { edges: [] } }),
      },
      props
    )

    const toggle = await screen.findByTestId("city-saved-list-view-toggle")
    expect(await screen.findAllByTestId("city-event-row")).toHaveLength(1)

    fireEvent.press(toggle)

    // The list unmounts in map mode, same trade the event list and itinerary screens make:
    // the map is a mode of this screen, not a screen of its own.
    expect(screen.queryAllByTestId("city-event-row")).toHaveLength(0)
    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action_name: "cityGuideShowMap",
        action_type: "tap",
        owner_type: "CityGuide",
        owner_slug: "london-united-kingdom",
      })
    )

    fireEvent.press(screen.getByTestId("city-saved-list-view-toggle"))

    expect(await screen.findAllByTestId("city-event-row")).toHaveLength(1)
    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({ action_name: "cityGuideShowList" })
    )
  })

  it("hides the map toggle when nothing has valid coordinates", async () => {
    renderWithRelay(
      {
        FollowsAndSaves: () => ({
          shows: { edges: [{ node: { name: "Frida Kahlo", location: {} } }] },
        }),
        City: () => ({ name: "London", fairsConnection: { edges: [] } }),
      },
      props
    )

    await screen.findAllByTestId("city-event-row")

    expect(screen.queryByTestId("city-saved-list-view-toggle")).toBeNull()
  })
})
