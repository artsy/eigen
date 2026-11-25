import { act, fireEvent, screen, waitFor } from "@testing-library/react-native"
import { MyCollectionListing_resaleSubmission$data } from "__generated__/MyCollectionListing_resaleSubmission.graphql"
import { MyCollectionListingQueryRenderer } from "app/Scenes/MyCollection/Screens/MyCollectionListing/MyCollectionListing"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { goBack, navigate } from "app/system/navigation/navigate"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import {
  MY_COLLECTION_REFRESH_KEY,
  RefreshEvents,
  refreshMyCollection,
} from "app/utils/refreshHelpers"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { MockPayloadGenerator } from "relay-test-utils"

const mockShowToast = jest.fn()
jest.mock("app/Components/Toast/toastHook", () => ({
  useToast: () => ({ show: mockShowToast }),
}))

jest.mock("app/utils/refreshHelpers", () => ({
  ...jest.requireActual("app/utils/refreshHelpers"),
  refreshMyCollection: jest.fn(),
}))

type ResaleSubmission = Omit<MyCollectionListing_resaleSubmission$data, " $fragmentType">

const resaleSubmission = (overrides: Partial<ResaleSubmission> = {}): ResaleSubmission => ({
  internalID: "submission-1",
  isCancelable: true,
  isEditable: true,
  state: "LISTED",
  statusMessage: "Your work is listed on Artsy",
  priceListed: { display: "US$5,000" },
  submittedArtwork: {
    artistNames: "Pablo Picasso",
    title: "Guernica",
    date: "1937",
    image: null,
  },
  ...overrides,
})

describe("MyCollectionListing", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => <MyCollectionListingQueryRenderer resaleSubmissionID="submission-1" />,
  })

  const render = (overrides: Partial<ResaleSubmission> = {}) =>
    renderWithRelay({ Me: () => ({ resaleSubmission: resaleSubmission(overrides) }) })

  beforeEach(() => {
    jest.clearAllMocks()
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSellMyCollectionArtwork: true })
  })

  it("shows the artwork, the price and the status", async () => {
    await render()

    expect(await screen.findByText("Pablo Picasso")).toBeOnTheScreen()
    expect(screen.getByText("Guernica")).toBeOnTheScreen()
    expect(screen.getByText(/1937/)).toBeOnTheScreen()
    expect(screen.getByText("Listed at US$5,000")).toBeOnTheScreen()
    expect(screen.getByText("Your work is listed on Artsy")).toBeOnTheScreen()
  })

  it("shows the asking price until the work is listed", async () => {
    await render({ state: "ACCEPTED" })

    expect(await screen.findByText("Asking price US$5,000")).toBeOnTheScreen()
    expect(screen.queryByText(/Listed at/)).not.toBeOnTheScreen()
  })

  it("leaves out the price line without a listed price", async () => {
    await render({ priceListed: null })

    expect(await screen.findByText("Pablo Picasso")).toBeOnTheScreen()
    expect(screen.queryByText(/Listed at/)).not.toBeOnTheScreen()
  })

  it("refetches when My Collection refreshes, keeping the listing on screen", async () => {
    const view = await render({ statusMessage: "Accepted by Artsy" })

    expect(await screen.findByText("Accepted by Artsy")).toBeOnTheScreen()
    expect(view.env.mock.getAllOperations()).toHaveLength(0)

    await act(() => {
      RefreshEvents.emit(MY_COLLECTION_REFRESH_KEY)
    })

    expect(view.env.mock.getAllOperations()).toHaveLength(1)
    expect(screen.getByText("Accepted by Artsy")).toBeOnTheScreen()
    await view.mockResolveLastOperation({
      Me: () => ({ resaleSubmission: resaleSubmission({ statusMessage: "Listed on Artsy" }) }),
    })

    expect(await screen.findByText("Listed on Artsy")).toBeOnTheScreen()
  })

  it("shows the failure view with a back button when the query fails and refetches on retry", async () => {
    const env = getMockRelayEnvironment()
    await renderWithWrappers(<MyCollectionListingQueryRenderer resaleSubmissionID="submission-1" />)

    await act(() => {
      env.mock.rejectMostRecentOperation(new Error("Network request failed"))
    })

    expect(await screen.findByText("Unable to load")).toBeOnTheScreen()
    expect(screen.getByLabelText("Go back")).toBeOnTheScreen()
    expect(env.mock.getAllOperations()).toHaveLength(0)

    await fireEvent.press(screen.getByLabelText("Retry"))

    await waitFor(() =>
      expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
        "MyCollectionListingQuery"
      )
    )
    await act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, {
          Me: () => ({ resaleSubmission: resaleSubmission() }),
        })
      )
    })

    expect(await screen.findByText("Pablo Picasso")).toBeOnTheScreen()
  })

  it("goes back when the feature flag is off", async () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSellMyCollectionArtwork: false })
    await renderWithWrappers(<MyCollectionListingQueryRenderer resaleSubmissionID="submission-1" />)

    await waitFor(() => expect(goBack).toHaveBeenCalledTimes(1))
    expect(screen.queryByText("Pablo Picasso")).not.toBeOnTheScreen()
  })

  it("opens the sell flow at step 2 from Edit listing", async () => {
    await render()

    await fireEvent.press(await screen.findByText("Edit listing"))

    expect(navigate).toHaveBeenCalledWith("/my-collection/sell", {
      passProps: { resaleSubmissionID: "submission-1" },
    })
  })

  it("leaves out Edit listing when the submission can’t be edited", async () => {
    await render({ isEditable: false })

    expect(await screen.findByTestId("remove-listing-button")).toBeOnTheScreen()
    expect(screen.queryByText("Edit listing")).not.toBeOnTheScreen()
  })

  it("leaves out Remove listing when the submission can’t be canceled", async () => {
    await render({ isCancelable: false })

    expect(await screen.findByText("Edit listing")).toBeOnTheScreen()
    expect(screen.queryByTestId("remove-listing-button")).not.toBeOnTheScreen()
    expect(screen.queryByTestId("confirm-remove-listing-button")).not.toBeOnTheScreen()
  })

  it("offers no actions when the submission can’t be edited or canceled", async () => {
    await render({ isCancelable: false, isEditable: false })

    expect(await screen.findByText("Pablo Picasso")).toBeOnTheScreen()
    expect(screen.queryByText("Edit listing")).not.toBeOnTheScreen()
    expect(screen.queryByTestId("remove-listing-button")).not.toBeOnTheScreen()
  })

  describe("removing the listing", () => {
    const openConfirmation = async (view: Awaited<ReturnType<typeof render>>) => {
      await fireEvent.press(await screen.findByTestId("remove-listing-button"))
      return view
    }

    const confirmButton = () => screen.getByTestId("confirm-remove-listing-button")

    it("sends nothing until the collector confirms", async () => {
      const view = await openConfirmation(await render())

      expect(
        screen.getByText(
          "The work stays in your collection but will no longer be listed for sale. You can list it again at any time."
        )
      ).toBeOnTheScreen()
      expect(screen.getByText("Keep listing")).toBeOnTheScreen()
      expect(view.env.mock.getAllOperations()).toHaveLength(0)
    })

    it("cancels the submission, refreshes My Collection and goes back", async () => {
      const view = await openConfirmation(await render())

      await fireEvent.press(confirmButton())

      const operation = view.env.mock.getMostRecentOperation()
      expect(operation.request.node.operation.name).toBe("useCancelResaleSubmissionMutation")
      expect(operation.request.variables).toEqual({ input: { id: "submission-1" } })

      await view.mockResolveLastOperation({
        CancelResaleSubmissionPayload: () => ({
          resaleSubmissionOrError: {
            __typename: "CancelResaleSubmissionSuccess",
            resaleSubmission: { internalID: "submission-1", state: "CANCELED" },
          },
        }),
      })

      await waitFor(() => expect(goBack).toHaveBeenCalledTimes(1))
      expect(refreshMyCollection).toHaveBeenCalledTimes(1)
      expect(mockShowToast).not.toHaveBeenCalled()
    })

    it("marks the confirm button as disabled while the removal runs", async () => {
      await openConfirmation(await render())

      expect(confirmButton().props.accessibilityState).toEqual({ disabled: false })

      await fireEvent.press(confirmButton())

      await waitFor(() =>
        expect(confirmButton().props.accessibilityState).toEqual({ disabled: true })
      )
    })

    it("sends nothing when the collector keeps the listing", async () => {
      const view = await openConfirmation(await render())

      await fireEvent.press(screen.getByText("Keep listing"))

      expect(view.env.mock.getAllOperations()).toHaveLength(0)
      expect(goBack).not.toHaveBeenCalled()
    })

    it("shows a toast and stays when the mutation fails", async () => {
      const view = await openConfirmation(await render())

      await fireEvent.press(confirmButton())
      await view.mockResolveLastOperation({
        CancelResaleSubmissionPayload: () => ({
          resaleSubmissionOrError: {
            __typename: "CancelResaleSubmissionFailure",
            mutationError: { message: "Nope" },
          },
        }),
      })

      await waitFor(() =>
        expect(mockShowToast).toHaveBeenCalledWith(
          "We couldn’t remove this listing. Please try again.",
          "bottom",
          expect.objectContaining({ backgroundColor: "red100" })
        )
      )
      expect(goBack).not.toHaveBeenCalled()
      expect(refreshMyCollection).not.toHaveBeenCalled()
    })
  })
})
