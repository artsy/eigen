import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import {
  useAuthNavigation,
  useAuthScreen,
} from "app/Scenes/Onboarding/Screens/Auth/hooks/useAuthNavigation"
import { ForgotPasswordStep } from "app/Scenes/Onboarding/Screens/Auth/scenes/ForgotPasswordStep"
import { GlobalStore } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/Scenes/Onboarding/Screens/Auth/hooks/useAuthNavigation", () => ({
  useAuthNavigation: jest.fn(),
  useAuthScreen: jest.fn().mockReturnValue({
    params: { email: "foo@bar.baz" },
  }),
}))

describe("ForgotPasswordStep", () => {
  const mockUseAuthNavigation = useAuthNavigation as jest.Mock
  const mockUseAuthScreen = useAuthScreen as jest.Mock

  it("disables the 'send reset link' button when the email address is invalid", async () => {
    renderWithWrappers(<ForgotPasswordStep />)
    expect(screen.getByDisplayValue("foo@bar.baz")).toBeOnTheScreen()
    expect(screen.getByText("Send Reset Link")).toBeEnabled()
    fireEvent.changeText(screen.getByA11yHint("Enter your email address"), "invalid-email")
    await waitFor(() => expect(screen.getByText("Send Reset Link")).toBeDisabled())
  })

  describe("when a reset link is successfully requested", () => {
    beforeEach(() => {
      jest.spyOn(GlobalStore.actions.auth, "forgotPassword").mockResolvedValue(true)
      mockUseAuthNavigation.mockReturnValue({
        /**
         * When the user successfully requests a password reset, we add a requestedPasswordReset param
         * to the screen so that a confirmation message can be displayed on the next render. This
         * simulates that by updating the useAuthScreen mock to return the new params.
         */
        setParams: jest.fn().mockImplementation((params) => {
          mockUseAuthScreen.mockReturnValue({
            params: { ...mockUseAuthScreen().params, ...params },
          })
        }),
        navigate: jest.fn(),
      })
    })

    afterEach(() => {
      /**
       * Restore the useAuthScreen mock to its default state after each test so that subsequent
       * tests don't start on the confirmation screen.
       */
      mockUseAuthScreen.mockReturnValue({
        params: { email: "foo@bar.baz" },
      })
    })

    it("shows a confirmation message", async () => {
      renderWithWrappers(<ForgotPasswordStep />)
      fireEvent.press(screen.getByText("Send Reset Link"))
      await waitFor(() => expect(screen.queryByA11yHint("Enter your email address")).toBeNull())
      expect(
        screen.getByText(
          "Password reset link sent—check your email. Please note, you must wait 5 minutes to receive another link."
        )
      ).toBeOnTheScreen()
    })

    // TODO: This is timing out often in CI, if anyone has time to investigate, please do!
    // https://app.circleci.com/pipelines/github/artsy/eigen/69547/workflows/2c9061ec-5a41-449f-b3af-6446b7228bc9/jobs/242171/tests#failed-test-0
    // it("sends a reset link when the 'send again' button is pressed", async () => {
    //   renderWithWrappers(<ForgotPasswordStep />)
    //   fireEvent.press(screen.getByText("Send Reset Link"))
    //   await waitFor(() => expect(screen.queryByA11yHint("Enter your email address")).toBeNull())
    //   await waitFor(() => expect(screen.getByText("Send Again")).toBeEnabled())
    //   fireEvent.press(screen.getByText("Send Again"))
    //   await waitFor(() => expect(GlobalStore.actions.auth.forgotPassword).toHaveBeenCalledTimes(2))
    // })

    it("returns to the login screen when the 'return to login' button is pressed", async () => {
      renderWithWrappers(<ForgotPasswordStep />)
      fireEvent.press(screen.getByText("Send Reset Link"))
      await waitFor(() => expect(screen.queryByA11yHint("Enter your email address")).toBeNull())
      fireEvent.press(screen.getByText("Return to Login"))
      await waitFor(() =>
        expect(mockUseAuthNavigation().navigate).toHaveBeenCalledWith({
          name: "LoginWelcomeStep",
        })
      )
    })
  })

  it("displays an error message if the reset link could not be sent", async () => {
    jest.spyOn(GlobalStore.actions.auth, "forgotPassword").mockResolvedValue(false)
    renderWithWrappers(<ForgotPasswordStep />)
    fireEvent.press(screen.getByText("Send Reset Link"))
    await screen.findByText(
      "Couldn't send reset password link. Please try again, or contact support@artsy.net"
    )
  })
})
