import { act, fireEvent, screen } from "@testing-library/react-native"
import { useRecaptcha } from "app/Components/Recaptcha/Recaptcha"
import { AuthContext } from "app/Scenes/Onboarding/Screens/Auth/AuthContext"
import { useAuthNavigation } from "app/Scenes/Onboarding/Screens/Auth/hooks/useAuthNavigation"
import { LoginWelcomeStep } from "app/Scenes/Onboarding/Screens/Auth/scenes/LoginWelcomeStep"
import { GlobalStore } from "app/store/GlobalStore"
import { osMajorVersion } from "app/utils/platformUtil"
import { mockNavigate } from "app/utils/tests/navigationMocks"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Platform } from "react-native"

jest.mock("app/Scenes/Onboarding/Screens/Auth/hooks/useAuthNavigation")
jest.mock("app/Scenes/Onboarding/Screens/Auth/hooks/useInputAutofocus")
jest.mock("app/utils/platformUtil")
jest.mock("app/Components/Recaptcha/Recaptcha", () => ({
  useRecaptcha: jest.fn().mockReturnValue({ Recaptcha: () => {}, token: "recaptcha-token" }),
}))

describe("LoginWelcomeStep", () => {
  const mockUseAuthNavigation = useAuthNavigation as jest.Mock
  const mockUseRecaptcha = useRecaptcha as jest.Mock
  const mockOSMajorVersion = osMajorVersion as jest.Mock

  beforeEach(() => {
    /**
     * This component involves animations, so we need to mock timers to ensure that the animations
     * are completed before making assertions.
     */
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it("expands the modal when the input field is tapped", () => {
    renderWelcomeStep()

    expect(screen.queryByA11yHint("Go back to the previous screen")).not.toBeOnTheScreen()
    expect(screen.queryByA11yHint("Continue to the next screen")).not.toBeOnTheScreen()
    expect(screen.getByTestId("social-signin-and-disclaimers")).toHaveAnimatedStyle({ opacity: 1 })

    fireEvent(screen.getByA11yHint("Enter your email address"), "focus")

    expect(screen.getByA11yHint("Go back to the previous screen")).toBeOnTheScreen()
    expect(screen.getByA11yHint("Continue to the next screen")).toBeOnTheScreen()
    expect(screen.queryByTestId("social-signin-and-disclaimers")).not.toBeOnTheScreen()
  })

  describe("when the modal is expanded", () => {
    it("closes the modal when the back icon is tapped", () => {
      renderExpandedWelcomeStep()

      fireEvent.press(screen.getByA11yHint("Go back to the previous screen"))
      act(() => {
        jest.advanceTimersByTime(1000)
      })

      expect(screen.queryByA11yHint("Go back to the previous screen")).not.toBeOnTheScreen()
      expect(screen.queryByA11yHint("Continue to the next screen")).not.toBeOnTheScreen()
      expect(screen.getByTestId("social-signin-and-disclaimers")).toHaveAnimatedStyle({
        opacity: 1,
      })
    })

    it("navigates to the sign-up password step if a user account doesn't exist", async () => {
      GlobalStore.actions.auth.verifyUser = jest
        .fn()
        .mockResolvedValue("user_does_not_exist") as any

      const navigateSpy = jest.fn()
      mockUseAuthNavigation.mockReturnValueOnce({
        navigate: navigateSpy,
      })

      renderExpandedWelcomeStep()

      fireEvent.changeText(screen.getByA11yHint("Enter your email address"), "foo@bar.baz")

      // eslint-disable-next-line testing-library/no-unnecessary-act
      await act(() => fireEvent.press(screen.getByA11yHint("Continue to the next screen")))

      expect(navigateSpy).toHaveBeenCalledWith({
        name: "SignUpPasswordStep",
        params: { email: "foo@bar.baz" },
      })
    })

    it("navigates to the login password step if a user account exists", async () => {
      GlobalStore.actions.auth.verifyUser = jest.fn().mockResolvedValue("user_exists") as any

      const navigateSpy = jest.fn()
      mockUseAuthNavigation.mockReturnValueOnce({
        navigate: navigateSpy,
      })

      renderExpandedWelcomeStep()

      fireEvent.changeText(screen.getByA11yHint("Enter your email address"), "foo@bar.baz")
      fireEvent.press(screen.getByA11yHint("Continue to the next screen"))

      // eslint-disable-next-line testing-library/no-unnecessary-act
      await act(() => fireEvent.press(screen.getByA11yHint("Continue to the next screen")))

      expect(navigateSpy).toHaveBeenCalledWith({
        name: "LoginPasswordStep",
        params: { email: "foo@bar.baz" },
      })
    })

    it("navigates to the login password step if recaptcha fails", async () => {
      mockUseRecaptcha.mockReturnValueOnce({ Recaptcha: () => {}, token: null })

      const navigateSpy = jest.fn()
      mockUseAuthNavigation.mockReturnValueOnce({
        navigate: navigateSpy,
      })

      renderExpandedWelcomeStep()

      fireEvent.changeText(screen.getByA11yHint("Enter your email address"), "foo@bar.baz")
      fireEvent.press(screen.getByA11yHint("Continue to the next screen"))

      // eslint-disable-next-line testing-library/no-unnecessary-act
      await act(() => fireEvent.press(screen.getByA11yHint("Continue to the next screen")))

      expect(navigateSpy).toHaveBeenCalledWith({
        name: "LoginPasswordStep",
        params: { email: "foo@bar.baz", showSignUpLink: true },
      })
    })
  })

  it("shows the Sign in with Apple button on iOS versions >= 13 ", () => {
    mockOSMajorVersion.mockReturnValue(13)
    renderWelcomeStep()
    expect(screen.getByA11yHint("Sign in with Apple")).toBeOnTheScreen()
  })

  it("shows the Sign in with Apple button on iOS versions < 13", () => {
    mockOSMajorVersion.mockReturnValue(12)
    renderWelcomeStep()
    expect(screen.queryByA11yHint("Sign in with Apple")).not.toBeOnTheScreen()
  })

  it("hides the Sign in with Apple button on Android", () => {
    Platform.OS = "android"
    renderWelcomeStep()
    expect(screen.queryByA11yHint("Sign in with Apple")).not.toBeOnTheScreen()
  })

  it("provides a link to the terms and conditions", async () => {
    renderWelcomeStep()

    fireEvent.press(screen.getByA11yHint("View the Terms and Conditions"))

    expect(mockNavigate).toHaveBeenCalledWith("OnboardingWebView", { url: "/terms" })
  })

  it("provides a link to the privacy policy", async () => {
    renderWelcomeStep()

    fireEvent.press(screen.getByA11yHint("View the Privacy Policy"))

    expect(mockNavigate).toHaveBeenCalledWith("OnboardingWebView", { url: "/privacy" })
  })
})

const renderWelcomeStep = () => {
  renderWithWrappers(
    <AuthContext.Provider>
      <LoginWelcomeStep />
    </AuthContext.Provider>
  )
  jest.advanceTimersByTime(400)
}

const renderExpandedWelcomeStep = () => {
  renderWelcomeStep()
  fireEvent(screen.getByA11yHint("Enter your email address"), "focus")
  jest.advanceTimersByTime(1000)
}
