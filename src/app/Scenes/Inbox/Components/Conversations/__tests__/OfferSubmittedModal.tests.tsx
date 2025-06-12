import { act, fireEvent, screen, waitFor } from "@testing-library/react-native"
import { OfferSubmittedModal } from "app/Scenes/Inbox/Components/Conversations/OfferSubmittedModal"
import { goBack, switchTab } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

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
  beforeEach(() => {
    jest.useFakeTimers({ advanceTimers: true })
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it("renders", async () => {
    renderWithWrappers(<OfferSubmittedModal />)

    act(() => callback?.({ orderCode: "1234", message: "Test message" }))

    jest.advanceTimersByTime(2000)

    await screen.findByText("Thank you, your offer has been submitted")

    expect(screen.getByText("Thank you, your offer has been submitted")).toBeOnTheScreen()
    expect(
      screen.getByText("Negotiation with the gallery will continue in the Inbox.")
    ).toBeOnTheScreen()
    expect(screen.getByText("Offer #1234")).toBeOnTheScreen()
    expect(screen.getByText("Test message")).toBeOnTheScreen()
    expect(goBack).toHaveBeenCalledTimes(1)
  })

  it("onGoToInbox", async () => {
    renderWithWrappers(<OfferSubmittedModal />)
    act(() => callback?.({ orderCode: "1234", message: "Test message" }))

    jest.advanceTimersByTime(2000)

    fireEvent.press(screen.getByText("Go to inbox"))

    await waitFor(() => expect(switchTab).toHaveBeenCalledWith("inbox"))
  })
})
