import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ItineraryPicker } from "app/Scenes/CityGuide/Components/ItineraryPicker"
import { navigate } from "app/system/navigation/navigate"
import { mockSetParams } from "app/utils/tests/navigationMocks"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("ItineraryPicker", () => {
  const { renderWithRelay } = setupTestWrapper({ Component: ItineraryPicker })
  const props = {
    citySlug: "london-united-kingdom",
    currentItineraryId: "a",
    currentItineraryName: "London Oct 2026",
  }

  const itinerary = (internalID: string, name: string) => ({
    internalID,
    slug: null,
    title: name,
    stopsCount: 4,
  })

  const connection = (nodes: object[]) => ({
    Me: () => ({ itinerariesConnection: { edges: nodes.map((node) => ({ node })) } }),
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("does not request sections that would replace the screen's populated sections", () => {
    const query = require("__generated__/ItineraryPickerQuery.graphql").default
    expect(JSON.stringify(query.operation)).not.toContain('"name":"sections"')
  })

  it("shows the top-level stop count", async () => {
    renderWithRelay(connection([itinerary("a", "London Oct 2026")]), props)

    fireEvent.press(await screen.findByText("London Oct 2026"))

    expect(await screen.findByText("4 stops")).toBeOnTheScreen()
  })

  it("names the itinerary being viewed", async () => {
    renderWithRelay(connection([itinerary("a", "London Oct 2026")]), props)

    expect(await screen.findByText("London Oct 2026")).toBeOnTheScreen()
  })

  // It used to be gated on having more than one, which read as a dead button for anyone with
  // exactly one — the common case while nothing can create them yet.
  it("still opens with only one itinerary", async () => {
    renderWithRelay(connection([itinerary("a", "London Oct 2026")]), props)

    await screen.findByTestId("itinerary-picker")

    fireEvent.press(screen.getByText("London Oct 2026"))

    expect(await screen.findByText("Your Itineraries")).toBeOnTheScreen()
  })

  it("lists the others once there is more than one", async () => {
    renderWithRelay(
      connection([itinerary("a", "London Oct 2026"), itinerary("b", "London Winter")]),
      props
    )

    fireEvent.press(await screen.findByText("London Oct 2026"))

    expect(await screen.findByText("London Winter")).toBeOnTheScreen()
  })

  it("switches to the itinerary that is picked", async () => {
    const view = renderWithRelay(
      connection([itinerary("a", "London Oct 2026"), itinerary("b", "London Winter")]),
      props
    )

    fireEvent.press(await screen.findByText("London Oct 2026"))
    fireEvent.press(await screen.findByText("London Winter"))

    // Resolve the picker's own itinerariesConnection first, then the pre-fetch it kicks off.
    await waitFor(() => expect(view.env.mock.getAllOperations().length).toBe(1))
    view.mockResolveLastOperation({
      Itinerary: () => ({ internalID: "b", title: "London Winter" }),
    })

    await waitFor(() => expect(mockSetParams).toHaveBeenCalledWith({ itineraryId: "b" }))

    // It swaps the screen's params in place rather than pushing a new one.
    expect(navigate).not.toHaveBeenCalled()
  })

  it("is a no-op when the active itinerary is tapped", async () => {
    renderWithRelay(
      connection([itinerary("a", "London Oct 2026"), itinerary("b", "London Winter")]),
      props
    )

    fireEvent.press(await screen.findByText("London Oct 2026"))
    fireEvent.press(screen.getAllByText("London Oct 2026")[1])

    expect(mockSetParams).not.toHaveBeenCalled()
    await waitFor(() => expect(screen.queryByText("Your Itineraries")).not.toBeOnTheScreen())
  })
})
