import { fireEvent, screen } from "@testing-library/react-native"
import { Sell } from "app/Scenes/Sell/Sell"
import { dismissModal } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

// setupJest stubs useNavigation, but this test drives the real stack
jest.mock("@react-navigation/native", () => jest.requireActual("@react-navigation/native"))

describe("Sell", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("starts on the first step", () => {
    renderWithWrappers(<Sell />)

    expect(screen.getByText("Step 1 · Decide Which Works to Sell")).toBeOnTheScreen()
    expect(screen.getByLabelText("Step 1 of 3")).toBeOnTheScreen()
    expect(screen.getByText(/Tap the works you've considered selling/)).toBeOnTheScreen()
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
    expect(dismissModal).toHaveBeenCalledTimes(1)
  })

  it("goes back from the works summary to the work selection, then leaves the flow", async () => {
    renderWithWrappers(<Sell />)

    fireEvent.press(screen.getByText("Verify If Sellable"))
    await screen.findByText("Start Consignment")

    fireEvent.press(screen.getByLabelText("Go back"))
    expect(await screen.findByText("Verify If Sellable")).toBeOnTheScreen()
    expect(dismissModal).not.toHaveBeenCalled()

    fireEvent.press(screen.getByLabelText("Go back"))
    expect(dismissModal).toHaveBeenCalledTimes(1)
  })
})
