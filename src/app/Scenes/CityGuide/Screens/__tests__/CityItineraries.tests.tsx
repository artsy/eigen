import { act, fireEvent, screen, waitFor } from "@testing-library/react-native"
import { CityItinerariesScreenQueryRenderer } from "app/Scenes/CityGuide/Screens/CityItineraries"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { RefreshControl } from "react-native"
import RNShare from "react-native-share"
import { MockPayloadGenerator } from "relay-test-utils"

jest.mock("react-native-share", () => ({ open: jest.fn() }))

describe("CityItineraries", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: CityItinerariesScreenQueryRenderer,
  })
  const props = { citySlug: "london-united-kingdom" }

  const itinerary = (internalID: string, name: string, stopsCounts: number[]) => ({
    internalID,
    slug: null,
    title: name,
    description: "If time, check out Borough Market",
    isCurated: false,
    shareToken: null,
    heroImage: { resized: { url: `https://example.com/${internalID}.jpg` }, url: null },
    stopsCount: stopsCounts.reduce((a, b) => a + b, 0),
  })

  const connection = (nodes: object[]) => ({
    Me: () => ({ itinerariesConnection: { edges: nodes.map((node) => ({ node })) } }),
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the title and a row per itinerary", async () => {
    renderWithRelay(
      connection([itinerary("a", "London Oct 2026", [10, 6]), itinerary("b", "Berlin", [3])]),
      props
    )

    expect(await screen.findByText("Your Itineraries")).toBeOnTheScreen()
    expect(screen.getByText("London Oct 2026")).toBeOnTheScreen()
    expect(screen.getByText("16 stops")).toBeOnTheScreen()
    expect(screen.getByText("Berlin")).toBeOnTheScreen()
  })

  it("opens an itinerary when its row is tapped", async () => {
    renderWithRelay(connection([itinerary("a", "London Oct 2026", [1])]), props)

    fireEvent.press(await screen.findByText("London Oct 2026"))

    expect(navigate).toHaveBeenCalledWith("/city-guide/london-united-kingdom/itinerary/a")
  })

  it("renders a share control per row", async () => {
    renderWithRelay(connection([itinerary("a", "London Oct 2026", [1])]), props)

    expect(await screen.findByLabelText("Share London Oct 2026")).toBeOnTheScreen()
  })

  it("mints a share token and shares the link when pressed", async () => {
    const view = renderWithRelay(connection([itinerary("a", "London Oct 2026", [1])]), props)

    fireEvent.press(await screen.findByLabelText("Share London Oct 2026"))

    await waitFor(() =>
      expect(view.env.mock.getMostRecentOperation().request.node.params.name).toBe(
        "useItineraryShareMintTokenMutation"
      )
    )
    expect(view.env.mock.getMostRecentOperation().request.variables.input).toEqual({
      id: "a",
      generateShareToken: true,
    })

    view.env.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Mutation: () => ({
          updateItinerary: {
            responseOrError: {
              __typename: "ItineraryMutationSuccess",
              itinerary: { internalID: "a", shareToken: "abc123" },
            },
          },
        }),
      })
    )

    await waitFor(() => expect(RNShare.open).toHaveBeenCalled())
    expect(RNShare.open).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining(
          "https://staging.artsy.net/city-guide/london-united-kingdom/itinerary/a?shareToken=abc123"
        ),
      })
    )
  })

  it("says so when the user has no itineraries here", async () => {
    renderWithRelay(connection([]), props)

    expect(await screen.findByText(/haven’t started an itinerary/)).toBeOnTheScreen()
  })

  // Not in the designs, but the sheet needs an entry point and this screen is the only place
  // ownership is guaranteed — it queries through `me`.
  it("opens the edit sheet from a row, prefilled with the itinerary", async () => {
    renderWithRelay(connection([itinerary("a", "London Oct 2026", [1])]), props)

    fireEvent.press(await screen.findByLabelText("Edit London Oct 2026"))

    expect(await screen.findByText("Edit Itinerary")).toBeOnTheScreen()
    expect(screen.getByTestId("itinerary-edit-name")).toHaveProp("value", "London Oct 2026")
    expect(screen.getByTestId("itinerary-edit-notes")).toHaveProp(
      "value",
      "If time, check out Borough Market"
    )
  })

  // An empty-string cursor makes ConnectionHandler refuse the merge: "Unexpected after
  // cursor, edges must be fetched from the end of the list".
  it("reloads after a delete without sending a cursor", async () => {
    const view = renderWithRelay(connection([itinerary("a", "London Oct 2026", [1])]), props)

    fireEvent.press(await screen.findByLabelText("Edit London Oct 2026"))
    fireEvent.press(await screen.findByTestId("itinerary-edit-delete"))

    view.mockResolveLastOperation({
      deleteItineraryPayload: () => ({
        responseOrError: { __typename: "ItineraryMutationSuccess" },
      }),
    })

    await waitFor(() => {
      const refetch = view.env.mock
        .getAllOperations()
        .find((op) => op.request.node.params.name === "CityItinerariesPaginationQuery")

      expect(refetch?.request.variables.cursor).toBeNull()
    })
  })

  it("refetches the list on pull to refresh", async () => {
    const view = renderWithRelay(
      { Me: () => ({ itinerariesConnection: { edges: [{ node: itinerary("a", "A", [2]) }] } }) },
      props
    )

    await screen.findByText("A")

    act(() => {
      screen.UNSAFE_getByType(RefreshControl).props.onRefresh()
    })

    await waitFor(() => expect(view.env.mock.getAllOperations().length).toBe(1))
    expect(view.env.mock.getAllOperations()[0].request.node.params.name).toBe(
      "CityItinerariesPaginationQuery"
    )
    expect(screen.getByText("A")).toBeOnTheScreen()
  })
})
