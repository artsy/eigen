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
  useRecaptcha: jest.fn().mockReturnValue({
    Recaptcha: () => {},
    token: "recaptcha-token",
    isTokenValid: jest.fn(() => true),
    refreshToken: jest.fn(),
  }),
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
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it("expands the modal when the input field is tapped", async () => {
    await renderWelcomeStep()

    expect(screen.queryByHintText("Go back to the previous screen")).not.toBeOnTheScreen()
    expect(screen.queryByHintText("Continue to the next screen")).not.toBeOnTheScreen()
    expect(screen.getByTestId("social-signin-and-disclaimers")).toHaveStyle({ opacity: 1 })

    await fireEvent(screen.getByHintText("Enter your email address"), "focus")

    expect(screen.getByHintText("Go back to the previous screen")).toBeOnTheScreen()
    expect(screen.getByHintText("Continue to the next screen")).toBeOnTheScreen()
    expect(screen.queryByTestId("social-signin-and-disclaimers")).not.toBeOnTheScreen()
  })

  describe("when the modal is expanded", () => {
    it("closes the modal when the back icon is tapped", async () => {
      await renderExpandedWelcomeStep()

      await fireEvent.press(screen.getByHintText("Go back to the previous screen"))
      await act(() => {
        jest.advanceTimersByTime(1000)
      })

      expect(screen.queryByHintText("Go back to the previous screen")).not.toBeOnTheScreen()
      expect(screen.queryByHintText("Continue to the next screen")).not.toBeOnTheScreen()
      expect(screen.getByTestId("social-signin-and-disclaimers")).toHaveStyle({
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

      await renderExpandedWelcomeStep()

      await fireEvent.changeText(screen.getByHintText("Enter your email address"), "foo@bar.baz")

      await fireEvent.press(screen.getByHintText("Continue to the next screen"))

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

      await renderExpandedWelcomeStep()

      await fireEvent.changeText(screen.getByHintText("Enter your email address"), "foo@bar.baz")
      await fireEvent.press(screen.getByHintText("Continue to the next screen"))

      await fireEvent.press(screen.getByHintText("Continue to the next screen"))

      expect(navigateSpy).toHaveBeenCalledWith({
        name: "LoginPasswordStep",
        params: { email: "foo@bar.baz" },
      })
    })

    it("triggers token refresh when token is missing and retries after refresh", async () => {
      const refreshTokenSpy = jest.fn()
      const isTokenValidSpy = jest.fn()
      let tokenValue: string | null = null

      isTokenValidSpy.mockImplementation(() => tokenValue !== null)

      mockUseRecaptcha.mockReturnValue({
        Recaptcha: () => {},
        get token() {
          return tokenValue
        },
        state: undefined,
        isTokenValid: isTokenValidSpy,
        refreshToken: () => {
          refreshTokenSpy()
          // Simulate token refresh completing
          tokenValue = "new-recaptcha-token"
        },
      })

      GlobalStore.actions.auth.verifyUser = jest.fn().mockResolvedValue("user_exists") as any

      const navigateSpy = jest.fn()
      mockUseAuthNavigation.mockReturnValue({
        navigate: navigateSpy,
      })

      await renderExpandedWelcomeStep()

      await fireEvent.changeText(screen.getByHintText("Enter your email address"), "foo@bar.baz")

      await fireEvent.press(screen.getByHintText("Continue to the next screen"))
      await act(() => {
        jest.runAllTimers()
      })

      expect(refreshTokenSpy).toHaveBeenCalled()
      expect(GlobalStore.actions.auth.verifyUser).toHaveBeenCalledWith({
        email: "foo@bar.baz",
        recaptchaToken: "new-recaptcha-token",
      })
      expect(navigateSpy).toHaveBeenCalledWith({
        name: "LoginPasswordStep",
        params: { email: "foo@bar.baz" },
      })
    })

    it("triggers token refresh when token is expired", async () => {
      const refreshTokenSpy = jest.fn()
      const isTokenValidSpy = jest.fn(() => false)

      mockUseRecaptcha.mockReturnValue({
        Recaptcha: () => {},
        token: "expired-token",
        state: undefined,
        isTokenValid: isTokenValidSpy,
        refreshToken: refreshTokenSpy,
      })

      const navigateSpy = jest.fn()
      mockUseAuthNavigation.mockReturnValue({
        navigate: navigateSpy,
      })

      await renderExpandedWelcomeStep()

      await fireEvent.changeText(screen.getByHintText("Enter your email address"), "foo@bar.baz")

      await fireEvent.press(screen.getByHintText("Continue to the next screen"))

      await act(() => {
        jest.advanceTimersByTime(1000)
      })

      await act(() => {
        jest.advanceTimersByTime(50)
      })

      expect(refreshTokenSpy).toHaveBeenCalled()
      expect(navigateSpy).not.toHaveBeenCalled()
    })

    it("shows a toast when token refresh fails", async () => {
      const refreshTokenSpy = jest.fn()
      const isTokenValidSpy = jest.fn(() => false)

      mockUseRecaptcha.mockReturnValue({
        Recaptcha: () => {},
        token: null,
        state: "error",
        isTokenValid: isTokenValidSpy,
        refreshToken: refreshTokenSpy,
      })

      const toastSpy = jest.spyOn(GlobalStore.actions.toast, "add")

      const navigateSpy = jest.fn()
      mockUseAuthNavigation.mockReturnValue({
        navigate: navigateSpy,
      })

      await renderExpandedWelcomeStep()

      await fireEvent.changeText(screen.getByHintText("Enter your email address"), "foo@bar.baz")

      await fireEvent.press(screen.getByHintText("Continue to the next screen"))
      await act(() => {
        jest.runAllTimers()
      })

      expect(toastSpy).toHaveBeenCalledWith({
        message: "Something went wrong. Please try again, or contact support@artsy.net",
        placement: "bottom",
        options: { backgroundColor: "red100" },
      })
      expect(refreshTokenSpy).toHaveBeenCalled()
      expect(navigateSpy).not.toHaveBeenCalled()
    })

    it("shows an inline error for invalid email format", async () => {
      await renderExpandedWelcomeStep()
      await fireEvent.changeText(screen.getByHintText("Enter your email address"), "invalidemail")

      // Validation now settles before the next interaction, so Continue is already disabled.
      // Submit from the keyboard instead, which still runs Formik's submit and shows the error.
      expect(screen.getByHintText("Continue to the next screen")).toBeDisabled()
      await fireEvent(screen.getByHintText("Enter your email address"), "submitEditing")

      await act(() => {
        jest.runAllTimers()
      })
      expect(screen.getByText("Please provide a valid email address")).toBeTruthy()
    })
  })

  it("shows the Sign in with Apple button on iOS versions >= 13 ", async () => {
    mockOSMajorVersion.mockReturnValue(13)
    await renderWelcomeStep()
    expect(screen.getByHintText("Sign in with Apple")).toBeOnTheScreen()
  })

  it("shows the Sign in with Apple button on iOS versions < 13", async () => {
    mockOSMajorVersion.mockReturnValue(12)
    await renderWelcomeStep()
    expect(screen.queryByHintText("Sign in with Apple")).not.toBeOnTheScreen()
  })

  it("hides the Sign in with Apple button on Android", async () => {
    Platform.OS = "android"
    await renderWelcomeStep()
    expect(screen.queryByHintText("Sign in with Apple")).not.toBeOnTheScreen()
  })

  it("provides a link to the terms and conditions", async () => {
    await renderWelcomeStep()

    await fireEvent.press(screen.getByHintText("View the Terms and Conditions"))

    expect(mockNavigate).toHaveBeenCalledWith("OnboardingWebView", { url: "/terms" })
  })

  it("provides a link to the privacy policy", async () => {
    await renderWelcomeStep()

    await fireEvent.press(screen.getByHintText("View the Privacy Policy"))

    expect(mockNavigate).toHaveBeenCalledWith("OnboardingWebView", { url: "/privacy" })
  })
})

const renderWelcomeStep = async () => {
  await renderWithWrappers(
    <AuthContext.Provider>
      <LoginWelcomeStep />
    </AuthContext.Provider>
  )
  jest.advanceTimersByTime(400)
}

const renderExpandedWelcomeStep = async () => {
  await renderWelcomeStep()
  await fireEvent(screen.getByHintText("Enter your email address"), "focus")
  jest.advanceTimersByTime(1000)
}
