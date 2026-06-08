import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import {
  useAuthNavigation,
  useAuthScreen,
} from "app/Scenes/Onboarding/Screens/Auth/hooks/useAuthNavigation"
import { LoginPasswordStep } from "app/Scenes/Onboarding/Screens/Auth/scenes/LoginPasswordStep"
import { GlobalStore } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Alert } from "react-native"

jest.mock("app/Scenes/Onboarding/Screens/Auth/hooks/useAuthNavigation")

describe("LoginPasswordStep", () => {
  const mockUseAuthNavigation = useAuthNavigation as jest.Mock
  const mockUseAuthScreen = useAuthScreen as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuthNavigation.mockReturnValue({
      navigate: jest.fn(),
    })
    mockUseAuthScreen.mockReturnValue({
      name: "SignUpPasswordStep",
      params: { email: "foo@bar.baz" },
    })
  })

  /**
   * GlobalStore.actions.auth.signIn is responsible for taking the user to the home screen when
   * login succeeds, so this test will only assert that it was called.
   */
  it("calls the global login function", async () => {
    jest.spyOn(GlobalStore.actions.auth, "signIn").mockResolvedValue("success")
    renderWithWrappers(<LoginPasswordStep />)
    fireEvent.changeText(screen.getByA11yHint("Enter your password"), "Password1")
    fireEvent.press(screen.getByA11yHint("Continue to the next screen"))
    await waitFor(() => expect(GlobalStore.actions.auth.signIn).toHaveBeenCalled())
  })

  it("navigates to the standard OTP step with required", async () => {
    jest.spyOn(GlobalStore.actions.auth, "signIn").mockResolvedValue("otp_missing")
    renderWithWrappers(<LoginPasswordStep />)
    fireEvent.changeText(screen.getByA11yHint("Enter your password"), "Password1")
    fireEvent.press(screen.getByA11yHint("Continue to the next screen"))
    await waitFor(() =>
      expect(mockUseAuthNavigation().navigate).toHaveBeenCalledWith({
        name: "LoginOTPStep",
        params: { email: "foo@bar.baz", password: "Password1", otpMode: "standard" }, // pragma: allowlist secret
      })
    )
  })

  it("navigates to the on-demand OTP step when required", async () => {
    jest.spyOn(GlobalStore.actions.auth, "signIn").mockResolvedValue("on_demand_otp_missing")
    renderWithWrappers(<LoginPasswordStep />)
    fireEvent.changeText(screen.getByA11yHint("Enter your password"), "Password1")
    fireEvent.press(screen.getByA11yHint("Continue to the next screen"))
    await waitFor(() =>
      expect(mockUseAuthNavigation().navigate).toHaveBeenCalledWith({
        name: "LoginOTPStep",
        params: { email: "foo@bar.baz", password: "Password1", otpMode: "on_demand" }, // pragma: allowlist secret
      })
    )
  })

  it("shows an error when auth is blocked", async () => {
    jest.spyOn(GlobalStore.actions.auth, "signIn").mockResolvedValue("auth_blocked")
    jest.spyOn(Alert, "alert")
    renderWithWrappers(<LoginPasswordStep />)
    fireEvent.changeText(screen.getByA11yHint("Enter your password"), "Password1")
    fireEvent.press(screen.getByA11yHint("Continue to the next screen"))
    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith(
        "Sign in attempt blocked",
        "Please try signing in from a different internet connection or contact support@artsy.net for help.",
        expect.any(Array)
      )
    )
  })

  it("shows a toast when login fails", async () => {
    jest.spyOn(GlobalStore.actions.auth, "signIn").mockResolvedValue("failure")
    const toastSpy = jest.spyOn(GlobalStore.actions.toast, "add")
    renderWithWrappers(<LoginPasswordStep />)
    fireEvent.changeText(screen.getByA11yHint("Enter your password"), "Password1")
    fireEvent.press(screen.getByA11yHint("Continue to the next screen"))
    await waitFor(() =>
      expect(toastSpy).toHaveBeenCalledWith({
        message: "Something went wrong. Please try again, or contact support@artsy.net",
        placement: "bottom",
        options: { backgroundColor: "red100" },
      })
    )
  })

  it("shows an inline error when login fails with bad email or password", async () => {
    jest.spyOn(GlobalStore.actions.auth, "signIn").mockResolvedValue("invalid_credentials")
    const toastSpy = jest.spyOn(GlobalStore.actions.toast, "add")
    renderWithWrappers(<LoginPasswordStep />)
    fireEvent.changeText(screen.getByA11yHint("Enter your password"), "Password1")
    fireEvent.press(screen.getByA11yHint("Continue to the next screen"))
    expect(toastSpy).not.toHaveBeenCalled()
    await screen.findByText("Incorrect email or password")
  })

  describe("when showLoginLink param is true", () => {
    beforeEach(() => {
      mockUseAuthScreen.mockReturnValue({
        name: "SignUpPasswordStep",
        params: {
          email: "foo@bar.baz",
          showSignUpLink: true,
        },
      })
    })

    it("navigates to the sign-up screen when the login link is pressed", () => {
      renderWithWrappers(<LoginPasswordStep />)
      fireEvent.press(screen.getByA11yHint("Go to the sign-up screen"))
      expect(mockUseAuthNavigation().navigate).toHaveBeenCalledWith({
        name: "SignUpPasswordStep",
        params: { email: "foo@bar.baz", showLoginLink: true },
      })
    })
  })
})
