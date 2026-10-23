import { act, fireEvent, screen } from "@testing-library/react-native"
import { Sell } from "app/Scenes/Sell/Sell"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { dismissModal, goBack, navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Alert, BackHandler } from "react-native"

// setupJest stubs useNavigation, but this test drives the real stack
jest.mock("@react-navigation/native", () => jest.requireActual("@react-navigation/native"))

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

  return () => {
    act(() => {
      ;[...listeners]
        .reverse()
        .some((listener) => listener({ type: "hardwareBackPress", timeStamp: Date.now() }))
    })
  }
}

// isWorkSellable treats an even last hex digit as sellable
const collection = {
  Me: () => ({
    myCollectionConnection: {
      edges: [
        { node: { internalID: "work-2", title: "Sellable Work", artistNames: "Artist A" } },
        { node: { internalID: "work-3", title: "Unsellable Work", artistNames: "Artist B" } },
      ],
    },
  }),
}

const { renderWithRelay } = setupTestWrapper({ Component: Sell })

const renderSell = async () => {
  renderWithRelay(collection)
  await screen.findByTestId("artworkGridItem-Sellable Work")
}

const openWorksSummary = async () => {
  fireEvent.press(screen.getByTestId("artworkGridItem-Sellable Work"))
  fireEvent.press(screen.getByText("Verify If Sellable"))
  fireEvent.press(await screen.findByText("Proceed to Listing"))
  await screen.findByText("Start Consignment")
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
    expect(screen.getByText(/Tap the works you've considered selling/)).toBeOnTheScreen()
  })

  it("closes straight away when the feature flag is off", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSellMyCollectionArtwork: false })
    renderWithWrappers(<Sell />)

    expect(screen.queryByText("Step 1 · Decide Which Works to Sell")).not.toBeOnTheScreen()
    expect(dismissModal).toHaveBeenCalledTimes(1)
  })

  it("keeps the verify button disabled until a work is selected", async () => {
    await renderSell()

    expect(screen.getByText("Verify If Sellable")).toBeDisabled()

    fireEvent.press(screen.getByTestId("artworkGridItem-Sellable Work"))
    expect(screen.getByText("Verify If Sellable")).toBeEnabled()
    expect(navigate).not.toHaveBeenCalled()

    fireEvent.press(screen.getByTestId("artworkGridItem-Sellable Work"))
    expect(screen.getByText("Verify If Sellable")).toBeDisabled()
  })

  it("splits the selection into works we can and can't sell", async () => {
    await renderSell()

    fireEvent.press(screen.getByTestId("artworkGridItem-Sellable Work"))
    fireEvent.press(screen.getByTestId("artworkGridItem-Unsellable Work"))
    fireEvent.press(screen.getByText("Verify If Sellable"))

    expect(await screen.findByText("A note on your selection")).toBeOnTheScreen()
    expect(screen.getByText(/We can help you with 1\/2 of the works/)).toBeOnTheScreen()
    expect(screen.getByText("Not able to sell yet")).toBeOnTheScreen()

    const sellableToggle = screen.getByRole("checkbox", { name: "Artist A, Sellable Work" })
    expect(sellableToggle).toBeChecked()
    expect(screen.queryByRole("checkbox", { name: "Artist B, Unsellable Work" })).toBeNull()

    fireEvent.press(sellableToggle)
    expect(sellableToggle).not.toBeChecked()
    expect(screen.getByText("Proceed to Listing")).toBeDisabled()
  })

  it("walks through every step and shows the confirmation on submit", async () => {
    await renderSell()

    await openWorksSummary()
    expect(screen.getByText("Step 1 · Decide Which Works to Sell")).toBeOnTheScreen()
    expect(screen.getByLabelText("Step 1 of 3")).toBeOnTheScreen()
    expect(screen.getByText(/We reviewed demand for these works/)).toBeOnTheScreen()

    fireEvent.press(screen.getByText("Start Consignment"))
    expect(await screen.findByText("Step 2 · Condition & Price")).toBeOnTheScreen()
    expect(screen.getByLabelText("Step 2 of 3")).toBeOnTheScreen()

    fireEvent.press(screen.getByText("Continue"))
    expect(await screen.findByText("Step 3 · Shipping Options")).toBeOnTheScreen()

    fireEvent.press(screen.getByText("Submit for Review"))
    expect(await screen.findByText("Submitted!")).toBeOnTheScreen()
    expect(screen.getByText("Step 3 · Shipping Options")).toBeOnTheScreen()

    fireEvent.press(screen.getByText("Return to My Collection"))
    expect(goBack).toHaveBeenCalledTimes(1)
  })

  it("goes back from the works summary to the work selection, then leaves the flow", async () => {
    await renderSell()

    await openWorksSummary()

    fireEvent.press(screen.getByLabelText("Go back"))
    expect(await screen.findByText("Verify If Sellable")).toBeEnabled()
    expect(dismissModal).not.toHaveBeenCalled()

    fireEvent.press(screen.getByLabelText("Close"))
    expect(dismissModal).toHaveBeenCalledTimes(1)
  })

  it("handles Android hardware back on the works summary and on later steps", async () => {
    const pressHardwareBack = mockHardwareBack()
    await renderSell()

    await openWorksSummary()

    pressHardwareBack()
    expect(await screen.findByText("Verify If Sellable")).toBeOnTheScreen()

    fireEvent.press(screen.getByText("Verify If Sellable"))
    fireEvent.press(await screen.findByText("Proceed to Listing"))
    fireEvent.press(await screen.findByText("Start Consignment"))
    await screen.findByText("Step 2 · Condition & Price")

    pressHardwareBack()
    expect(await screen.findByText("Start Consignment")).toBeOnTheScreen()
    expect(dismissModal).not.toHaveBeenCalled()
  })

  it("asks for confirmation before closing the flow past the first screen", async () => {
    const alertSpy = jest.spyOn(Alert, "alert")
    await renderSell()

    await openWorksSummary()

    fireEvent.press(screen.getByLabelText("Close"))
    expect(alertSpy).toHaveBeenCalledWith("Leave this flow?", expect.any(String), expect.any(Array))
    expect(dismissModal).not.toHaveBeenCalled()

    const buttons = alertSpy.mock.calls[0][2]!
    buttons.find((button) => button.text === "Leave")?.onPress?.()
    expect(dismissModal).toHaveBeenCalledTimes(1)
  })
})
