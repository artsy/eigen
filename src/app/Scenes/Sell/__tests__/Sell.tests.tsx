import { act, fireEvent, screen } from "@testing-library/react-native"
import { Sell } from "app/Scenes/Sell/Sell"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { dismissModal, goBack } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Alert, BackHandler } from "react-native"

// setupJest stubs useNavigation, but this test drives the real stack
jest.mock("@react-navigation/native", () => jest.requireActual("@react-navigation/native"))

describe("Sell", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSellMyCollectionArtwork: true })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("starts on the first step", () => {
    renderWithWrappers(<Sell />)

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

  it("walks through every step and shows the confirmation on submit", async () => {
    renderWithWrappers(<Sell />)

    fireEvent.press(screen.getByText("Verify If Sellable"))
    expect(await screen.findByText("Start Consignment")).toBeOnTheScreen()
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
    renderWithWrappers(<Sell />)

    fireEvent.press(screen.getByText("Verify If Sellable"))
    await screen.findByText("Start Consignment")

    fireEvent.press(screen.getByLabelText("Go back"))
    expect(await screen.findByText("Verify If Sellable")).toBeOnTheScreen()
    expect(dismissModal).not.toHaveBeenCalled()

    fireEvent.press(screen.getByLabelText("Close"))
    expect(dismissModal).toHaveBeenCalledTimes(1)
  })

  it("returns from the works summary to the work selection on Android hardware back", async () => {
    const addEventListener = jest.spyOn(BackHandler, "addEventListener")
    renderWithWrappers(<Sell />)

    fireEvent.press(screen.getByText("Verify If Sellable"))
    await screen.findByText("Start Consignment")

    const handler = addEventListener.mock.calls
      .filter(([event]) => event === "hardwareBackPress")
      .at(-1)?.[1]

    let handled: boolean | null | undefined
    act(() => {
      handled = handler?.({ type: "hardwareBackPress", timeStamp: Date.now() })
    })

    expect(handled).toBe(true)
    expect(await screen.findByText("Verify If Sellable")).toBeOnTheScreen()
    expect(dismissModal).not.toHaveBeenCalled()
  })

  it("asks for confirmation before closing the flow past the first screen", async () => {
    const alertSpy = jest.spyOn(Alert, "alert")
    renderWithWrappers(<Sell />)

    fireEvent.press(screen.getByText("Verify If Sellable"))
    await screen.findByText("Start Consignment")

    fireEvent.press(screen.getByLabelText("Close"))
    expect(alertSpy).toHaveBeenCalledWith("Leave this flow?", expect.any(String), expect.any(Array))
    expect(dismissModal).not.toHaveBeenCalled()

    const buttons = alertSpy.mock.calls[0][2]!
    buttons.find((button) => button.text === "Leave")?.onPress?.()
    expect(dismissModal).toHaveBeenCalledTimes(1)
  })
})
