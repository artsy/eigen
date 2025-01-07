import { act, fireEvent, screen } from "@testing-library/react-native"
import { goBack, switchTab } from "app/system/navigation/navigate"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { OfferSubmittedModal } from "./OfferSubmittedModal"

jest.mock("app/system/navigation/navigate", () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  switchTab: jest.fn(),
}))

let callback: undefined | (([...args]: any) => void)
jest.mock("app/utils/useWebViewEvent", () => ({
  useSetWebViewCallback: (_: string, cb: ([...args]: any) => void) => {
    callback = cb
    return jest.fn()
  },
}))

describe("OfferSubmittedModal", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders", async () => {
    renderWithWrappers(<OfferSubmittedModal />)
    act(() => callback?.({ orderCode: "1234", message: "Test message" }))

    await flushPromiseQueue()

    expect(screen.getByText("Thank you, your offer has been submitted")).toBeTruthy()
    expect(
      screen.getByText("Negotiation with the gallery will continue in the Inbox.")
    ).toBeTruthy()
    expect(screen.getByText("Offer #1234")).toBeTruthy()
    expect(screen.getByText("Test message")).toBeTruthy()
    expect(goBack).toHaveBeenCalledTimes(1)
  })

  it("onGoToInbox", async () => {
    renderWithWrappers(<OfferSubmittedModal />)
    act(() => callback?.({ orderCode: "1234", message: "Test message" }))

    await flushPromiseQueue()
    fireEvent.press(screen.getAllByText("Go to inbox")[0])

    // Wait for modal dismissal
    await flushPromiseQueue()
    expect(switchTab).toHaveBeenCalledWith("inbox")
  })
})
