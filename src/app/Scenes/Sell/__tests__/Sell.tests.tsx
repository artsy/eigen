import { act, fireEvent, screen, waitFor } from "@testing-library/react-native"
import { Sell } from "app/Scenes/Sell/Sell"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { dismissModal, goBack, navigate } from "app/system/navigation/navigate"
import { getLocationDetails, getLocationPredictions } from "app/utils/googleMaps"
import { refreshMyCollection } from "app/utils/refreshHelpers"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Alert, BackHandler } from "react-native"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"

// setupJest stubs useNavigation, but this test drives the real stack
jest.mock("@react-navigation/native", () => jest.requireActual("@react-navigation/native"))

const mockShowToast = jest.fn()
jest.mock("app/Components/Toast/toastHook", () => ({
  useToast: () => ({ show: mockShowToast }),
}))

jest.mock("app/utils/googleMaps", () => ({
  getLocationPredictions: jest.fn(),
  getLocationDetails: jest.fn(),
}))

jest.mock("app/utils/refreshHelpers", () => ({
  ...jest.requireActual("app/utils/refreshHelpers"),
  refreshMyCollection: jest.fn(),
}))

const SAVED_ADDRESS = {
  internalID: "address-1",
  name: "Collector",
  addressLine1: "401 Broadway",
  city: "New York",
  region: "NY",
  postalCode: "10013",
  country: "US",
  isDefault: true,
  phoneNumber: "555 0100",
}

const NEW_PLACE = { id: "place-2", name: "1 Main St, Brooklyn, NY, USA" }

const NEW_ADDRESS = {
  ...SAVED_ADDRESS,
  internalID: "address-2",
  addressLine1: "1 Main St",
  city: "Brooklyn",
  postalCode: "11201",
  isDefault: false,
  phoneNumber: null,
}

type BackPressHandler = Parameters<typeof BackHandler.addEventListener>[1]

/**
 * BackHandler never fires in the iOS test environment, so record the live listeners and call them
 * the way Android does: newest first, stopping at the first one that handles the press.
 */
const mockHardwareBack = () => {
  const listeners: BackPressHandler[] = []

  jest.spyOn(BackHandler, "addEventListener").mockImplementation((_event, handler) => {
    listeners.push(handler)
    return { remove: () => listeners.splice(listeners.indexOf(handler), 1) }
  })

  return async () => {
    await act(() => {
      ;[...listeners]
        .reverse()
        .some((listener) => listener({ type: "hardwareBackPress", timeStamp: Date.now() }))
    })
  }
}

// What createResaleSubmissions answers for each work in the collection
const RESALE_SUBMISSIONS: Record<string, object> = {
  "id-a2": {
    state: "ACCEPTED",
    channel: "MARKETPLACE",
    recommendedPriceMin: { currencyPrefix: "US$", amount: "2,800" },
    recommendedPriceMax: { amount: "3,600" },
  },
  "id-c3": { state: "REJECTED", channel: null },
  "id-b4": { state: "ACCEPTED", channel: "AUCTION" },
}

const resaleSubmissionFor = (artworkID: string) => ({
  internalID: `resaleSubmission-${artworkID}`,
  recommendedPriceMin: null,
  recommendedPriceMax: null,
  ...RESALE_SUBMISSIONS[artworkID],
})

// `me` keeps one id across queries, as it does in the app
const collection = {
  Me: () => ({
    id: "me",
    myCollectionConnection: {
      edges: [
        {
          node: {
            id: "id-a2",
            internalID: "id-a2",
            title: "Sellable Work",
            artistNames: "Artist A",
          },
        },
        {
          node: {
            id: "id-c3",
            internalID: "id-c3",
            title: "Unsellable Work",
            artistNames: "Artist B",
          },
        },
        {
          node: {
            id: "id-b4",
            internalID: "id-b4",
            title: "Auction Work",
            artistNames: "Artist C",
          },
        },
      ],
    },
  }),
}

const { renderWithRelay } = setupTestWrapper({ Component: Sell })

const renderSell = async (resolvers: MockResolvers = collection) => {
  const view = await renderWithRelay(resolvers)
  await screen.findByTestId("artworkGridItem-Sellable Work")
  return view
}

type SellView = Awaited<ReturnType<typeof renderSell>>

const operationNames = (view: SellView) =>
  view.env.mock.getAllOperations().map((operation) => operation.request.node.operation.name)

/** Answers the create call for each work it sent, failing the ones in `failedIDs` */
const resolveVerify = async (view: SellView, failedIDs: string[] = []) => {
  await waitFor(() => expect(operationNames(view)).toContain("useCreateResaleSubmissionsMutation"))
  const { artworkIDs } = view.env.mock.getMostRecentOperation().request.variables.input

  await view.mockResolveLastOperation({
    CreateResaleSubmissionsPayload: () => ({
      resaleSubmissionsOrErrors: artworkIDs.map((artworkID: string) =>
        failedIDs.includes(artworkID)
          ? { __typename: "CreateResaleSubmissionFailure", artworkID }
          : {
              __typename: "CreateResaleSubmissionSuccess",
              artworkID,
              resaleSubmission: resaleSubmissionFor(artworkID),
            }
      ),
    }),
  })

  return artworkIDs as string[]
}

/** Answers Step 2’s price save, and returns what it sent */
const resolveSavePrice = async (view: SellView, outcome: "success" | "failure" = "success") => {
  await waitFor(() => expect(operationNames(view)).toContain("useUpdateResaleSubmissionMutation"))
  const { input } = view.env.mock.getMostRecentOperation().request.variables

  await view.mockResolveLastOperation({
    UpdateResaleSubmissionPayload: () => ({
      resaleSubmissionOrError:
        outcome === "success"
          ? { __typename: "UpdateResaleSubmissionSuccess" }
          : { __typename: "UpdateResaleSubmissionFailure", mutationError: { message: "Nope" } },
    }),
  })

  return input
}

type ActiveArtwork = { internalID: string; artistNames: string; title?: string }

// Each step starts its query after the step change renders, which can lag behind the press on a
// busy CI runner. Wait for that operation to be pending, so we resolve it and not an older one.
const resolveWhenPending = async (
  view: SellView,
  operationName: string,
  resolvers: Parameters<SellView["mockResolveLastOperation"]>[0]
) => {
  await waitFor(() =>
    expect(view.env.mock.getMostRecentOperation().request.node.operation.name).toBe(operationName)
  )
  await view.mockResolveLastOperation(resolvers)
}

// Steps 2 and 3 load the active resale submission and its work. The shared ids keep generated
// ones from overwriting another work or submission in step 1.
const activeWorkResolvers = (artwork: ActiveArtwork) => ({
  Me: () => ({ id: "me" }),
  ResaleSubmission: () => ({
    id: `submission-${artwork.internalID}`,
    ...resaleSubmissionFor(artwork.internalID),
  }),
  Artwork: () => ({ id: artwork.internalID, ...artwork }),
})

const resolveActiveArtwork = (view: SellView, artwork: ActiveArtwork) =>
  resolveWhenPending(view, "ConditionQuery", activeWorkResolvers(artwork))

// Step 3 also loads the saved addresses, which the earlier steps never asked for
const resolveLocationStep = (view: SellView, artwork: ActiveArtwork) =>
  resolveWhenPending(view, "LocationAndContactQuery", {
    ...activeWorkResolvers(artwork),
    // A fixed id lets a saved address update this list
    Me: () => ({ id: "me", addressConnection: { edges: [{ node: SAVED_ADDRESS }] } }),
  })

const openAuctionConditionStep = async (view: SellView) => {
  await fireEvent.press(screen.getByTestId("artworkGridItem-Auction Work"))
  await fireEvent.press(screen.getByText("Verify If Sellable"))
  await resolveVerify(view)
  await fireEvent.press(await screen.findByText("Proceed to Listing"))
  await fireEvent.press(await screen.findByText("Start Submission"))
  await resolveActiveArtwork(view, { internalID: "id-b4", artistNames: "Artist C" })
  await screen.findByText("Step 2 · Condition")
}

const openWorksSummary = async (view: SellView) => {
  await fireEvent.press(screen.getByTestId("artworkGridItem-Sellable Work"))
  await fireEvent.press(screen.getByText("Verify If Sellable"))
  await resolveVerify(view)
  await fireEvent.press(await screen.findByText("Proceed to Listing"))
  await screen.findByText("Start Listing")
}

describe("Sell", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSellMyCollectionArtwork: true })
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  it("starts on the first step", async () => {
    await renderSell()

    expect(screen.getByText("Step 1 · Decide Which Works to Sell")).toBeOnTheScreen()
    expect(screen.getByLabelText("Step 1 of 3")).toBeOnTheScreen()
    expect(screen.getByText(/Tap the works you’ve considered selling/)).toBeOnTheScreen()
  })

  it("refreshes My Collection when the flow is left", async () => {
    await renderSell()
    jest.mocked(refreshMyCollection).mockClear()

    await screen.unmount()

    expect(refreshMyCollection).toHaveBeenCalledTimes(1)
  })

  it("closes straight away when the feature flag is off", async () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSellMyCollectionArtwork: false })
    await renderWithWrappers(<Sell />)

    expect(screen.queryByText("Step 1 · Decide Which Works to Sell")).not.toBeOnTheScreen()
    expect(dismissModal).toHaveBeenCalledTimes(1)
  })

  it("hides a work verified on an earlier visit when the flow opens again", async () => {
    const view = await renderSell()
    await fireEvent.press(screen.getByTestId("artworkGridItem-Sellable Work"))
    await fireEvent.press(screen.getByText("Verify If Sellable"))
    await resolveVerify(view)
    await view.unmount()

    // Throws if the screen reads its cached copy instead of asking again
    await renderWithRelay({
      Me: () => {
        const me = collection.Me()
        // The server leaves out works with an active resale submission
        const [, ...rest] = me.myCollectionConnection.edges
        return { ...me, myCollectionConnection: { edges: rest } }
      },
    })

    expect(await screen.findByTestId("artworkGridItem-Auction Work")).toBeOnTheScreen()
    expect(screen.queryByTestId("artworkGridItem-Sellable Work")).not.toBeOnTheScreen()
  })

  it("keeps the verify button disabled until a work is selected", async () => {
    await renderSell()

    expect(screen.getByText("Verify If Sellable")).toBeDisabled()

    await fireEvent.press(screen.getByTestId("artworkGridItem-Sellable Work"))
    expect(screen.getByText("Verify If Sellable")).toBeEnabled()
    expect(navigate).not.toHaveBeenCalled()

    await fireEvent.press(screen.getByTestId("artworkGridItem-Sellable Work"))
    expect(screen.getByText("Verify If Sellable")).toBeDisabled()
  })

  it("previews only the sellable works still ticked, each with its sales channel", async () => {
    const view = await renderSell()

    await fireEvent.press(screen.getByTestId("artworkGridItem-Sellable Work"))
    await fireEvent.press(screen.getByTestId("artworkGridItem-Unsellable Work"))
    await fireEvent.press(screen.getByTestId("artworkGridItem-Auction Work"))
    await fireEvent.press(screen.getByText("Verify If Sellable"))
    expect(await resolveVerify(view)).toEqual(["id-a2", "id-c3", "id-b4"])
    expect(await screen.findByText("Not able to sell yet")).toBeOnTheScreen()

    await fireEvent.press(await screen.findByRole("checkbox", { name: "Artist C, Auction Work" }))
    await fireEvent.press(screen.getByText("Proceed to Listing"))

    expect(await screen.findByText("Artsy Listing")).toBeOnTheScreen()
    expect(screen.getByText("Artist A")).toBeOnTheScreen()
    expect(screen.getByText("Start Listing")).toBeOnTheScreen()
    expect(screen.queryByText("Artist B")).not.toBeOnTheScreen()
    expect(screen.queryByText("Artist C")).not.toBeOnTheScreen()
    expect(screen.queryByText("Start Submission")).not.toBeOnTheScreen()
  })

  it("sends a work only once, even when verified again", async () => {
    const view = await renderSell()
    await openWorksSummary(view)

    await fireEvent.press(screen.getByLabelText("Go back"))
    await fireEvent.press(await screen.findByTestId("artworkGridItem-Auction Work"))
    await fireEvent.press(screen.getByText("Verify If Sellable"))

    expect(await resolveVerify(view)).toEqual(["id-b4"])
    expect(await screen.findByText("Proceed to Listing")).toBeOnTheScreen()
  })

  it("keeps the sheet closed when a work fails, then retries only that work", async () => {
    const view = await renderSell()

    await fireEvent.press(screen.getByTestId("artworkGridItem-Sellable Work"))
    await fireEvent.press(screen.getByTestId("artworkGridItem-Auction Work"))
    await fireEvent.press(screen.getByText("Verify If Sellable"))
    await resolveVerify(view, ["id-b4"])

    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith(
        "We couldn’t check your works. Please try again.",
        "bottom",
        expect.objectContaining({ backgroundColor: "red100" })
      )
    )
    expect(screen.queryByText("Proceed to Listing")).not.toBeOnTheScreen()

    // The toast shows a moment before the button stops loading, and a loading button ignores presses
    await waitFor(() => expect(screen.getByText("Verify If Sellable")).toBeVisible())
    await fireEvent.press(screen.getByText("Verify If Sellable"))
    expect(await resolveVerify(view)).toEqual(["id-b4"])
    expect(await screen.findByText("Proceed to Listing")).toBeOnTheScreen()
  })

  it("shows an error when the request fails", async () => {
    const view = await renderSell()

    await fireEvent.press(screen.getByTestId("artworkGridItem-Sellable Work"))
    await fireEvent.press(screen.getByText("Verify If Sellable"))
    await waitFor(() =>
      expect(operationNames(view)).toContain("useCreateResaleSubmissionsMutation")
    )
    await view.mockRejectLastOperation(new Error("Network request failed"))

    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith(
        "We couldn’t check your works. Please try again.",
        "bottom",
        expect.objectContaining({ backgroundColor: "red100" })
      )
    )
    expect(screen.getByText("Verify If Sellable")).toBeEnabled()
  })

  it("ignores taps on the grid while the works are being checked", async () => {
    const view = await renderSell()

    await fireEvent.press(screen.getByTestId("artworkGridItem-Sellable Work"))
    await fireEvent.press(screen.getByText("Verify If Sellable"))
    await fireEvent.press(screen.getByTestId("artworkGridItem-Auction Work"))

    expect(await resolveVerify(view)).toEqual(["id-a2"])
    expect(await screen.findByText(/We can help you with this work/)).toBeOnTheScreen()
  })

  it("walks through every step and shows the confirmation on submit", async () => {
    const view = await renderSell()

    await openWorksSummary(view)
    expect(screen.getByText("Step 1 · Decide Which Works to Sell")).toBeOnTheScreen()
    expect(screen.getByLabelText("Step 1 of 3")).toBeOnTheScreen()
    expect(screen.getByText(/We reviewed demand for these works/)).toBeOnTheScreen()

    await fireEvent.press(screen.getByText("Start Listing"))
    await resolveActiveArtwork(view, {
      internalID: "id-a2",
      artistNames: "Artist A",
      title: "Work A",
    })
    expect(await screen.findByText("Step 2 · Condition & Price")).toBeOnTheScreen()
    expect(screen.getByLabelText("Step 2 of 3")).toBeOnTheScreen()
    // The price section recommends the same range the card shows
    expect(screen.getByText("Estimated Value: US$2,800–3,600")).toBeOnTheScreen()
    expect(screen.getByText("US$2,800–3,600")).toBeOnTheScreen()
    expect(screen.getByText("Confirm Listing Price")).toBeDisabled()

    await fireEvent.press(screen.getByRole("radio", { name: /^Excellent\./ }))
    await waitFor(() => expect(screen.getByRole("radio", { name: /^Excellent\./ })).toBeChecked())
    expect(screen.getByText("Confirm Listing Price")).toBeDisabled()

    await fireEvent.changeText(screen.getByLabelText("Asking price"), "3200")
    expect(await screen.findByText("US$2,720")).toBeOnTheScreen()

    await fireEvent.press(screen.getByText("Confirm Listing Price"))
    expect(await resolveSavePrice(view)).toEqual({
      id: "resaleSubmission-id-a2",
      priceListed: "3200",
    })
    await resolveLocationStep(view, {
      internalID: "id-a2",
      artistNames: "Artist A",
      title: "Work A",
    })
    expect(await screen.findByText("Step 3 · Shipping Options")).toBeOnTheScreen()
    expect(screen.getByLabelText("Step 3 of 3")).toBeOnTheScreen()
    expect(screen.getByText("List Artwork")).toBeDisabled()
    // Step 3 selects the default address in an effect, after its first render
    await waitFor(() =>
      expect(screen.getByRole("radio", { name: /^Collector, 401 Broadway/ })).toBeChecked()
    )

    await fireEvent.press(screen.getByRole("radio", { name: /^Framed\./ }))
    await fireEvent.press(screen.getByRole("radio", { name: /^Courier packs\./ }))
    expect(screen.getByText("List Artwork")).toBeDisabled()

    await fireEvent.press(screen.getByRole("radio", { name: /^Courier needs to collect\./ }))
    await waitFor(() =>
      expect(screen.getByLabelText("Mobile number")).toHaveDisplayValue("555 0100")
    )
    await fireEvent.changeText(screen.getByLabelText("Mobile number"), "")
    expect(screen.getByText("List Artwork")).toBeDisabled()

    await fireEvent.changeText(screen.getByLabelText("Mobile number"), "555 0199")
    await waitFor(() => expect(screen.getByText("List Artwork")).toBeEnabled())
    await fireEvent.press(screen.getByText("List Artwork"))
    expect(await screen.findByText("Your listing is live!")).toBeOnTheScreen()
    expect(screen.getByText("Artist A’s Work A has been submitted for sale.")).toBeOnTheScreen()

    await fireEvent.press(screen.getByText("Return to My Collection"))
    expect(goBack).toHaveBeenCalledTimes(1)
  })

  it("shows an error on step 2 when the submission is no longer accepted", async () => {
    const view = await renderSell()
    await fireEvent.press(screen.getByTestId("artworkGridItem-Auction Work"))
    await fireEvent.press(screen.getByText("Verify If Sellable"))
    await resolveVerify(view)
    await fireEvent.press(await screen.findByText("Proceed to Listing"))
    await fireEvent.press(await screen.findByText("Start Submission"))

    const artwork = { internalID: "id-b4", artistNames: "Artist C" }
    const resolvers = activeWorkResolvers(artwork)
    await resolveWhenPending(view, "ConditionQuery", {
      ...resolvers,
      ResaleSubmission: () => ({ ...resolvers.ResaleSubmission(), state: "REJECTED" }),
    })

    expect(await screen.findByText("We couldn’t load this work.")).toBeOnTheScreen()
    expect(screen.queryByText("Continue")).not.toBeOnTheScreen()
  })

  it("shows an error on step 3 when the submission is no longer accepted", async () => {
    const view = await renderSell()
    await openAuctionConditionStep(view)
    await fireEvent.press(screen.getByRole("radio", { name: /^Fair\./ }))
    await waitFor(() => expect(screen.getByText("Continue")).toBeEnabled())
    await fireEvent.press(screen.getByText("Continue"))

    const artwork = { internalID: "id-b4", artistNames: "Artist C" }
    const resolvers = activeWorkResolvers(artwork)
    await resolveWhenPending(view, "LocationAndContactQuery", {
      ...resolvers,
      ResaleSubmission: () => ({ ...resolvers.ResaleSubmission(), state: "LISTED" }),
    })

    expect(await screen.findByText("We couldn’t load this work.")).toBeOnTheScreen()
    expect(screen.queryByText("Submit for Review")).not.toBeOnTheScreen()
  })

  describe("saving the asking price", () => {
    const openPriceStep = async (view: SellView) => {
      await openWorksSummary(view)
      await fireEvent.press(screen.getByText("Start Listing"))
      await resolveActiveArtwork(view, { internalID: "id-a2", artistNames: "Artist A" })
      await fireEvent.press(await screen.findByRole("radio", { name: /^Excellent\./ }))
      await fireEvent.changeText(screen.getByLabelText("Asking price"), "3200")
      await waitFor(() => expect(screen.getByText("Confirm Listing Price")).toBeEnabled())
    }

    const expectSaveError = () =>
      waitFor(() =>
        expect(mockShowToast).toHaveBeenCalledWith(
          "We couldn’t save your answers. Please try again.",
          "bottom",
          expect.objectContaining({ backgroundColor: "red100" })
        )
      )

    it("stays on step 2 when the save fails, and saves on the next try", async () => {
      const view = await renderSell()
      await openPriceStep(view)

      await fireEvent.press(screen.getByText("Confirm Listing Price"))
      await resolveSavePrice(view, "failure")
      await expectSaveError()
      expect(screen.getByText("Step 2 · Condition & Price")).toBeOnTheScreen()

      // A loading button ignores presses
      await waitFor(() => expect(screen.getByText("Confirm Listing Price")).toBeVisible())
      await fireEvent.press(screen.getByText("Confirm Listing Price"))
      await resolveSavePrice(view)
      await resolveLocationStep(view, { internalID: "id-a2", artistNames: "Artist A" })
      expect(await screen.findByText("Step 3 · Shipping Options")).toBeOnTheScreen()
    })

    it("stays on step 2 when the request fails", async () => {
      const view = await renderSell()
      await openPriceStep(view)

      await fireEvent.press(screen.getByText("Confirm Listing Price"))
      await waitFor(() =>
        expect(operationNames(view)).toContain("useUpdateResaleSubmissionMutation")
      )
      await view.mockRejectLastOperation(new Error("Network request failed"))

      await expectSaveError()
      expect(screen.getByText("Step 2 · Condition & Price")).toBeOnTheScreen()
    })

    it("sends nothing for an auction work, which has no price", async () => {
      const view = await renderSell()
      await openAuctionConditionStep(view)

      await fireEvent.press(screen.getByRole("radio", { name: /^Fair\./ }))
      await waitFor(() => expect(screen.getByText("Continue")).toBeEnabled())
      await fireEvent.press(screen.getByText("Continue"))

      expect(operationNames(view)).not.toContain("useUpdateResaleSubmissionMutation")
    })
  })

  it("asks auction works for a condition, then a location and phone number", async () => {
    const view = await renderSell()
    await openAuctionConditionStep(view)

    expect(screen.getByText("Artist C")).toBeOnTheScreen()
    expect(screen.getByText("Continue")).toBeDisabled()

    await fireEvent.press(screen.getByRole("radio", { name: /^Fair\./ }))
    await waitFor(() => expect(screen.getByText("Continue")).toBeEnabled())
    await fireEvent.press(screen.getByText("Continue"))
    await resolveLocationStep(view, { internalID: "id-b4", artistNames: "Artist C" })
    expect(await screen.findByText("Step 3 · Location & Contact")).toBeOnTheScreen()
    expect(screen.queryByText("How will this be packed?")).not.toBeOnTheScreen()
    await waitFor(() =>
      expect(screen.getByRole("radio", { name: /^Collector, 401 Broadway/ })).toBeChecked()
    )
    // The saved address's phone number fills the empty field
    await waitFor(() =>
      expect(screen.getByLabelText("Mobile number")).toHaveDisplayValue("555 0100")
    )

    await fireEvent.changeText(screen.getByLabelText("Mobile number"), "")
    await fireEvent(screen.getByLabelText("Mobile number"), "blur")
    expect(screen.getByText("Submit for Review")).toBeDisabled()
    expect(await screen.findByText("Phone number is required")).toBeOnTheScreen()

    await fireEvent.changeText(screen.getByLabelText("Mobile number"), "555 0199")
    await fireEvent.press(screen.getByText("Submit for Review"))
    expect(await screen.findByText("Submitted!")).toBeOnTheScreen()
    expect(screen.getByText(/One of our specialists will reach out/)).toBeOnTheScreen()
  })

  it("adds an address from step 3 and selects it there", async () => {
    ;(getLocationPredictions as jest.Mock).mockResolvedValue([NEW_PLACE])
    ;(getLocationDetails as jest.Mock).mockResolvedValue({
      ...NEW_PLACE,
      street: "1 Main St",
      city: "Brooklyn",
      stateCode: "NY",
      countryCode: "US",
      postalCode: "11201",
    })
    const view = await renderSell()
    await openAuctionConditionStep(view)
    await fireEvent.press(screen.getByRole("radio", { name: /^Fair\./ }))
    await fireEvent.press(screen.getByText("Continue"))
    await resolveLocationStep(view, { internalID: "id-b4", artistNames: "Artist C" })
    await screen.findByText("Step 3 · Location & Contact")
    await fireEvent.changeText(screen.getByLabelText("Mobile number"), "555 0199")

    await fireEvent.press(screen.getByLabelText("Add new address"))
    expect(await screen.findByText("Add address")).toBeOnTheScreen()
    // The step header has its own close button, so take the modal’s, which renders last
    await fireEvent.press(screen.getAllByLabelText("Close").at(-1)!)
    await waitFor(() => expect(screen.queryByText("Add address")).not.toBeOnTheScreen())
    expect(screen.getByLabelText("Mobile number")).toHaveDisplayValue("555 0199")

    await fireEvent.press(screen.getByLabelText("Add new address"))
    await screen.findByText("Add address")
    await fireEvent.changeText(screen.getByLabelText("Full name"), "Collector")
    await fireEvent.press(screen.getByTestId("sell-street-address"))
    await fireEvent.changeText(await screen.findByLabelText("Search addresses"), "1 Main")
    await fireEvent.press(await screen.findByText(NEW_PLACE.name))
    await waitFor(() => expect(screen.getByText("Save Address")).toBeEnabled())
    await fireEvent.press(screen.getByText("Save Address"))

    await resolveWhenPending(view, "useCreateUserAddressMutation", {
      CreateUserAddressPayload: () => ({
        me: {
          id: "me",
          addressConnection: {
            edges: [{ node: SAVED_ADDRESS }, { node: NEW_ADDRESS }],
          },
        },
        userAddressOrErrors: { __typename: "UserAddress", internalID: NEW_ADDRESS.internalID },
      }),
    })

    await waitFor(() =>
      expect(screen.getByRole("radio", { name: /^Collector, 1 Main St/ })).toBeChecked()
    )
    expect(screen.queryByText("Add address")).not.toBeOnTheScreen()
    expect(screen.getByLabelText("Mobile number")).toHaveDisplayValue("555 0199")
  })

  it("goes back from the works summary to the work selection, then leaves the flow", async () => {
    const view = await renderSell()

    await openWorksSummary(view)

    await fireEvent.press(screen.getByLabelText("Go back"))
    expect(await screen.findByText("Verify If Sellable")).toBeEnabled()
    expect(dismissModal).not.toHaveBeenCalled()

    await fireEvent.press(screen.getByLabelText("Close"))
    expect(dismissModal).toHaveBeenCalledTimes(1)
  })

  it("handles Android hardware back on the works summary and on later steps", async () => {
    const pressHardwareBack = mockHardwareBack()
    const view = await renderSell()

    await openWorksSummary(view)

    await pressHardwareBack()
    expect(await screen.findByText("Verify If Sellable")).toBeOnTheScreen()

    await fireEvent.press(screen.getByText("Verify If Sellable"))
    await fireEvent.press(await screen.findByText("Proceed to Listing"))
    await fireEvent.press(await screen.findByText("Start Listing"))
    await resolveActiveArtwork(view, { internalID: "id-a2", artistNames: "Artist A" })
    await screen.findByText("Step 2 · Condition & Price")

    await pressHardwareBack()
    expect(await screen.findByText("Start Listing")).toBeOnTheScreen()
    expect(dismissModal).not.toHaveBeenCalled()
  })

  it("asks before going back from step 2 with answers, then clears them", async () => {
    const alertSpy = jest.spyOn(Alert, "alert")
    const pressHardwareBack = mockHardwareBack()
    const view = await renderSell()
    await openAuctionConditionStep(view)

    await fireEvent.press(screen.getByRole("radio", { name: /^Fair\./ }))
    await waitFor(() => expect(screen.getByRole("radio", { name: /^Fair\./ })).toBeChecked())
    await fireEvent.press(screen.getByLabelText("Go back"))

    expect(alertSpy).toHaveBeenCalledWith(
      "Go back to step 1?",
      expect.any(String),
      expect.any(Array)
    )
    const buttons = alertSpy.mock.calls[0][2]!

    await act(() => buttons.find((button) => button.text === "Stay")?.onPress?.())
    expect(screen.getByRole("radio", { name: /^Fair\./ })).toBeChecked()

    await pressHardwareBack()
    expect(alertSpy).toHaveBeenCalledTimes(2)
    expect(alertSpy.mock.calls[1][0]).toBe("Go back to step 1?")
    expect(screen.getByRole("radio", { name: /^Fair\./ })).toBeChecked()

    await act(() => buttons.find((button) => button.text === "Go back")?.onPress?.())
    // The submission is already in the Relay store, so step 2 opens without a new query
    await fireEvent.press(await screen.findByText("Start Submission"))

    expect(await screen.findByRole("radio", { name: /^Fair\./ })).not.toBeChecked()
  })

  it("asks for confirmation before closing the flow past the first screen", async () => {
    const alertSpy = jest.spyOn(Alert, "alert")
    const view = await renderSell()

    await openWorksSummary(view)

    await fireEvent.press(screen.getByLabelText("Close"))
    expect(alertSpy).toHaveBeenCalledWith("Leave this flow?", expect.any(String), expect.any(Array))
    expect(dismissModal).not.toHaveBeenCalled()

    const buttons = alertSpy.mock.calls[0][2]!
    buttons.find((button) => button.text === "Leave")?.onPress?.()
    expect(dismissModal).toHaveBeenCalledTimes(1)
  })
})
