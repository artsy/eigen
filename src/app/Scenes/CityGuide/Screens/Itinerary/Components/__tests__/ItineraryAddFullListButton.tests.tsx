import { act, fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ItineraryAddFullListButton } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryAddFullListButton"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Schema } from "app/utils/track"
import { RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

describe("ItineraryAddFullListButton", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
    jest.clearAllMocks()
  })

  const renderIt = async (ownTitles: string[] = []) => {
    const view = renderWithWrappers(
      <RelayEnvironmentProvider environment={env}>
        <ItineraryAddFullListButton
          citySlug="london-united-kingdom"
          itineraryId="guide-1"
          title="Chill Vibes Only"
        />
      </RelayEnvironmentProvider>
    )

    await waitFor(() => expect(env.mock.getAllOperations()).toHaveLength(1))

    await act(async () => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, {
          Me: () => ({
            itinerariesConnection: { edges: ownTitles.map((title) => ({ node: { title } })) },
          }),
        })
      )
    })

    return view
  }

  /** Resolves the pending copy with a success or a failure payload. */
  const resolveCopy = async (responseOrError: object) => {
    await waitFor(() => expect(env.mock.getAllOperations()).toHaveLength(1))

    act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, {
          copyItineraryPayload: () => ({ responseOrError }),
        })
      )
    })
  }

  it("shows as already added when you own an itinerary with the same title", async () => {
    await renderIt(["Chill Vibes Only"])

    expect(await screen.findByText("Added")).toBeOnTheScreen()
    expect(screen.queryByTestId("itinerary-add-full-list")).not.toBeOnTheScreen()
  })

  it("ignores case and surrounding whitespace when matching titles", async () => {
    await renderIt([" chill vibes only "])

    expect(await screen.findByText("Added")).toBeOnTheScreen()
  })

  // One server-side call, rather than following each of the guide's entities in turn.
  it("copies the itinerary in one mutation", async () => {
    await renderIt()

    fireEvent.press(screen.getByTestId("itinerary-add-full-list"))

    await waitFor(() => expect(env.mock.getAllOperations()).toHaveLength(1))

    const operation = env.mock.getMostRecentOperation()

    expect(operation.request.node.params.name).toBe("ItineraryAddFullListButtonCopyMutation")
    expect(operation.request.variables).toEqual({ input: { id: "guide-1" } })
  })

  it("reports the guide as added once the copy lands", async () => {
    await renderIt()

    fireEvent.press(screen.getByTestId("itinerary-add-full-list"))
    await resolveCopy({
      __typename: "ItineraryMutationSuccess",
      itinerary: { internalID: "copy-1" },
    })

    expect(await screen.findByText("Added")).toBeOnTheScreen()
    expect(screen.queryByText("Add Full List")).not.toBeOnTheScreen()
  })

  it("stays actionable and says so when the copy fails", async () => {
    await renderIt()

    fireEvent.press(screen.getByTestId("itinerary-add-full-list"))
    await resolveCopy({
      __typename: "ItineraryMutationFailure",
      mutationError: { message: "Nope" },
    })

    // Still offering the copy rather than claiming it worked.
    expect(await screen.findByText("Add Full List")).toBeOnTheScreen()
    expect(screen.queryByText("Added")).not.toBeOnTheScreen()
  })

  it("tracks the copy against the itinerary", async () => {
    await renderIt()

    fireEvent.press(screen.getByTestId("itinerary-add-full-list"))
    await resolveCopy({
      __typename: "ItineraryMutationSuccess",
      itinerary: { internalID: "copy-1" },
    })

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action_name: Schema.ActionNames.TappedAddFullList,
        action_type: Schema.ActionTypes.Success,
        owner_slug: "london-united-kingdom",
        owner_id: "guide-1",
      })
    )
  })
})
