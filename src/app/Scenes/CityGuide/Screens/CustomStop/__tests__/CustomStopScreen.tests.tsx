import { act, screen, waitFor } from "@testing-library/react-native"
import { CustomStopScreen } from "app/Scenes/CityGuide/Screens/CustomStop/CustomStopScreen"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { RefreshControl } from "react-native"

// React-test-renderer has issues with memo components, so we need to mock the palette-mobile
// Image component. See https://github.com/facebook/react/issues/17301
jest.mock("@artsy/palette-mobile", () => ({
  ...jest.requireActual("@artsy/palette-mobile"),
  Image: require("react-native").Image,
}))

const STOP = {
  internalID: "stop-1",
  title: "Coffee at London Cafe",
  address: "12 Bermondsey Street",
  category: "GALLERY",
  note: "Small place, good pastries.",
  sourceURL: "https://timeout.com/london-cafe",
  isFreeAdmission: true,
  latitude: 51.5,
  longitude: -0.1,
  startTime: "10am",
  endTime: "6pm",
  image: { url: "https://example.com/cafe.jpg" },
  item: null,
}

describe("CustomStopScreen", () => {
  const { renderWithRelay } = setupTestWrapper({ Component: CustomStopScreen })
  const props = {
    citySlug: "london-united-kingdom",
    itineraryId: "chill-vibes-only",
    stopId: "stop-1",
  }

  const withStop = (overrides: object = {}, isCurated = true) => ({
    City: () => ({ name: "London" }),
    Itinerary: () => ({
      isCurated,
      sections: [{ stops: [{ ...STOP, ...overrides }] }],
    }),
  })

  it("renders every block the stop carries", async () => {
    renderWithRelay(withStop(), props)

    expect(await screen.findByText("Coffee at London Cafe")).toBeOnTheScreen()
    expect(screen.getByText("12 Bermondsey Street")).toBeOnTheScreen()
    expect(screen.getByText("Small place, good pastries.")).toBeOnTheScreen()
    expect(screen.getByText("10am-6pm · Free")).toBeOnTheScreen()
    expect(screen.getByTestId("custom-stop-category")).toBeOnTheScreen()
    expect(screen.getByTestId("custom-stop-source")).toBeOnTheScreen()
    expect(screen.getByTestId("custom-stop-image")).toHaveProp(
      "src",
      "https://example.com/cafe.jpg"
    )
  })

  // Each block is absent rather than empty, the way the Show screen's own bands are.
  it("leaves out the blocks the stop has no data for", async () => {
    renderWithRelay(
      withStop({
        address: null,
        category: null,
        note: null,
        sourceURL: null,
        isFreeAdmission: null,
        startTime: null,
        endTime: null,
      }),
      props
    )

    expect(await screen.findByText("Coffee at London Cafe")).toBeOnTheScreen()
    expect(screen.queryByTestId("custom-stop-address")).not.toBeOnTheScreen()
    expect(screen.queryByTestId("custom-stop-category")).not.toBeOnTheScreen()
    expect(screen.queryByTestId("custom-stop-source")).not.toBeOnTheScreen()
    expect(screen.queryByText("Small place, good pastries.")).not.toBeOnTheScreen()
  })

  it("hides the image section when the stop has no image", async () => {
    renderWithRelay(withStop({ image: null }), props)

    expect(await screen.findByText("Coffee at London Cafe")).toBeOnTheScreen()
    expect(screen.queryByTestId("custom-stop-image")).not.toBeOnTheScreen()
  })

  it("says so when the itinerary holds no such stop", async () => {
    renderWithRelay(withStop({ internalID: "another-stop" }), props)

    expect(await screen.findByText("This stop is no longer available.")).toBeOnTheScreen()
    expect(screen.queryByText("Coffee at London Cafe")).not.toBeOnTheScreen()
  })

  // A stop with an entity has its own page, so it must not render here.
  it("says so for a stop backed by an Artsy entity", async () => {
    renderWithRelay(withStop({ item: { __typename: "Show" } }), props)

    expect(await screen.findByText("This stop is no longer available.")).toBeOnTheScreen()
  })

  // A curated guide's custom stop can be copied onto your own itinerary. On your own it is
  // already there, so there is nothing to add.
  describe("add to itinerary", () => {
    it("offers to add a curated guide's stop", async () => {
      renderWithRelay(withStop(), props)

      expect(await screen.findByTestId("custom-stop-save-button")).toBeOnTheScreen()
    })

    it("offers nothing on your own itinerary", async () => {
      renderWithRelay(withStop({}, false), props)

      expect(await screen.findByText("Coffee at London Cafe")).toBeOnTheScreen()
      expect(screen.queryByTestId("custom-stop-save-button")).not.toBeOnTheScreen()
    })
  })

  it("refetches on pull to refresh without unmounting the stop", async () => {
    const view = renderWithRelay(withStop(), props)

    await screen.findByText("Coffee at London Cafe")

    act(() => {
      screen.UNSAFE_getByType(RefreshControl).props.onRefresh()
    })

    await waitFor(() => expect(view.env.mock.getAllOperations().length).toBe(1))
    expect(screen.getByText("Coffee at London Cafe")).toBeOnTheScreen()
  })
})
