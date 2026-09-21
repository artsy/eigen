import { Theme } from "@artsy/palette-mobile"
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native"
import { ItineraryStopSwipeRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopSwipeRow"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { Schema } from "app/utils/track"
import { Alert, Text } from "react-native"
import { PanGesture } from "react-native-gesture-handler"
import { fireGestureHandler, getByGestureTestId } from "react-native-gesture-handler/jest-utils"
import { RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

/** Presses whichever button `Alert.alert` was given that matches `style`. */
const pressAlertButton = (style: "destructive" | "cancel") => {
  const call = (Alert.alert as jest.Mock).mock.calls.at(-1)
  const buttons = call?.[2] as Array<{ style?: string; onPress?: () => void }> | undefined
  buttons?.find((button) => button.style === style)?.onPress?.()
}

const swipeOpen = () => {
  fireGestureHandler<PanGesture>(getByGestureTestId("pan-itinerary-stop-stop-1"), [
    { translationX: 0 },
    { translationX: -100 },
  ])
}

describe("ItineraryStopSwipeRow", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
    jest.spyOn(Alert, "alert").mockImplementation(() => undefined)
    mockTrackEvent.mockClear()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  const renderRow = (props: Partial<React.ComponentProps<typeof ItineraryStopSwipeRow>> = {}) =>
    render(
      <Theme>
        <RelayEnvironmentProvider environment={env}>
          <ItineraryStopSwipeRow
            stopID="stop-1"
            citySlug="london-united-kingdom"
            canDelete
            onSwipeBegin={jest.fn()}
            {...props}
          >
            <Text>Museum</Text>
          </ItineraryStopSwipeRow>
        </RelayEnvironmentProvider>
      </Theme>
    )

  it("renders children with no gesture wrapper when the itinerary isn't deletable", () => {
    renderRow({ canDelete: false })

    expect(screen.getByText("Museum")).toBeTruthy()
    expect(screen.queryByTestId("delete-button-stop-1")).toBeNull()
  })

  it("reveals the delete button on swipe and reports the swipe begin", () => {
    const onSwipeBegin = jest.fn()
    renderRow({ onSwipeBegin })

    swipeOpen()

    expect(screen.getByTestId("delete-button-stop-1")).toBeVisible()
    expect(onSwipeBegin).toHaveBeenCalledWith("stop-1")
  })

  it("confirms via Alert.alert before deleting", () => {
    renderRow()

    swipeOpen()
    fireEvent.press(screen.getByTestId("delete-button-stop-1"))

    expect(Alert.alert).toHaveBeenCalledWith(
      "Remove Stop",
      expect.any(String),
      expect.arrayContaining([expect.objectContaining({ text: "Delete", style: "destructive" })])
    )
  })

  it("removes the row and calls onDeleted after a confirmed delete succeeds", async () => {
    const onDeleted = jest.fn()
    renderRow({ onDeleted })

    swipeOpen()
    fireEvent.press(screen.getByTestId("delete-button-stop-1"))
    pressAlertButton("destructive")

    await waitFor(() =>
      expect(env.mock.getMostRecentOperation().request.node.params.name).toBe(
        "useDeleteItineraryStopMutation"
      )
    )

    env.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Mutation: () => ({
          deleteItineraryStop: {
            responseOrError: {
              __typename: "ItineraryStopMutationSuccess",
              itineraryStop: { internalID: "stop-1" },
            },
          },
        }),
      })
    )

    await waitFor(() => expect(onDeleted).toHaveBeenCalledWith("stop-1"))

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action_name: Schema.ActionNames.DeletedItineraryStop,
      action_type: Schema.ActionTypes.Swipe,
      owner_type: Schema.OwnerEntityTypes.CityGuide,
      owner_slug: "london-united-kingdom",
      owner_id: "stop-1",
    })
  })

  it("keeps the row and does not call onDeleted when the delete mutation fails", async () => {
    const onDeleted = jest.fn()
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => undefined)
    renderRow({ onDeleted })

    swipeOpen()
    fireEvent.press(screen.getByTestId("delete-button-stop-1"))
    pressAlertButton("destructive")

    await waitFor(() =>
      expect(env.mock.getMostRecentOperation().request.node.params.name).toBe(
        "useDeleteItineraryStopMutation"
      )
    )

    env.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Mutation: () => ({
          deleteItineraryStop: {
            responseOrError: {
              __typename: "ItineraryStopMutationFailure",
              mutationError: { message: "Nope" },
            },
          },
        }),
      })
    )

    await waitFor(() => expect(consoleError).toHaveBeenCalled())
    expect(onDeleted).not.toHaveBeenCalled()
    expect(mockTrackEvent).not.toHaveBeenCalled()
    expect(screen.getByText("Museum")).toBeTruthy()
  })
})
