import { fireEvent, screen } from "@testing-library/react-native"
import { LoginOTPStep } from "app/Scenes/Onboarding/Screens/Auth/scenes/LoginOTPStep"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const mockUseAuthScreen = jest.fn()

jest.mock("app/Scenes/Onboarding/Screens/Auth/hooks/useAuthNavigation", () => ({
  useAuthNavigation: jest.fn(),
  useAuthScreen: () => mockUseAuthScreen(),
}))

describe("LoginOTPStep", () => {
  beforeEach(() => {
    mockUseAuthScreen.mockReturnValue({ params: { otpMode: "standard" } })
  })

  it("renders correctly", () => {
    renderWithWrappers(<LoginOTPStep />)

    expect(screen.getByText("Authentication Code")).toBeDefined()
    expect(screen.getByText("Authentication code")).toBeDefined()
  })

  it("allows the user to switch between authentication and recovery codes", () => {
    renderWithWrappers(<LoginOTPStep />)

    const recoveryCodeButton = screen.getByText("Enter recovery code instead")
    expect(recoveryCodeButton).toBeDefined()

    fireEvent.press(recoveryCodeButton)

    expect(screen.getByText("Recovery code")).toBeDefined()
  })

  it("renders instructions when OTP mode is 'on_demand'", () => {
    mockUseAuthScreen.mockReturnValue({ params: { otpMode: "on_demand" } })

    renderWithWrappers(<LoginOTPStep />)

    expect(
      screen.getByText(
        "Your safety and security are important to us. Please check your email for a one-time authentication code to complete your login."
      )
    ).toBeDefined()
  })
})
