import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { MyAccountEditPhoneQueryRenderer } from "app/Scenes/MyAccount/MyAccountEditPhone"
import { updateMyUserProfile } from "app/Scenes/MyAccount/updateMyUserProfile"
import { goBack } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { validatePhoneNumber } from "app/utils/validatePhoneNumber"

jest.mock("app/Scenes/MyAccount/updateMyUserProfile", () => ({
  updateMyUserProfile: jest.fn(),
}))

// Validation is a debounced Metaphysics query; PhoneInput's own tests cover it
jest.mock("app/utils/validatePhoneNumber", () => ({
  validatePhoneNumber: jest.fn(),
}))

const mockUpdateMyUserProfile = updateMyUserProfile as jest.Mock
const mockValidatePhoneNumber = validatePhoneNumber as jest.Mock

describe("MyAccountEditPhoneQueryRenderer", () => {
  const { renderWithRelay } = setupTestWrapper({ Component: MyAccountEditPhoneQueryRenderer })

  beforeEach(() => {
    mockUpdateMyUserProfile.mockReset()
    ;(goBack as jest.Mock).mockClear()
    mockValidatePhoneNumber.mockResolvedValue(true)
  })

  it("pre-fills the saved phone number", async () => {
    await renderWithRelay({ Me: () => ({ phone: "+447825577664" }) })

    expect(screen.getByText("🇬🇧  +44")).toBeOnTheScreen()
    expect(screen.getByDisplayValue("7825 577664")).toBeOnTheScreen()
  })

  it("disables Save when the number becomes invalid", async () => {
    await renderWithRelay({ Me: () => ({ phone: "+447825577664" }) })

    // Save starts disabled, so first see it enabled by a valid number
    await waitFor(() => expect(screen.getByRole("button", { name: "Save" })).toBeEnabled())

    mockValidatePhoneNumber.mockResolvedValue(false)
    await fireEvent.changeText(screen.getByDisplayValue("7825 577664"), "78")

    await waitFor(() => expect(screen.getByRole("button", { name: "Save" })).toBeDisabled())
  })

  it("saves the number and goes back", async () => {
    mockUpdateMyUserProfile.mockResolvedValue(undefined)
    await renderWithRelay({ Me: () => ({ phone: "+447825577664" }) })

    // Save is enabled once the number has been validated (validation is async)
    await waitFor(() => expect(screen.getByRole("button", { name: "Save" })).toBeEnabled())
    await fireEvent.press(screen.getByRole("button", { name: "Save" }))

    expect(mockUpdateMyUserProfile).toHaveBeenCalledWith({ phone: "+447825577664" })
    expect(goBack).toHaveBeenCalled()
  })

  it("shows the error and stays on the screen when saving fails", async () => {
    mockUpdateMyUserProfile.mockRejectedValue("Phone number is invalid")
    await renderWithRelay({ Me: () => ({ phone: "+447825577664" }) })

    await waitFor(() => expect(screen.getByRole("button", { name: "Save" })).toBeEnabled())
    await fireEvent.press(screen.getByRole("button", { name: "Save" }))

    expect(await screen.findByText("Phone number is invalid")).toBeOnTheScreen()
    expect(goBack).not.toHaveBeenCalled()
  })
})
