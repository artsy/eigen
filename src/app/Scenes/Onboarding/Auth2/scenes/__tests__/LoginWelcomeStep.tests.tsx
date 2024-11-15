import { fireEvent, screen } from "@testing-library/react-native"
import { AuthContext } from "app/Scenes/Onboarding/Auth2/AuthContext"
import { LoginWelcomeStep } from "app/Scenes/Onboarding/Auth2/scenes/LoginWelcomeStep"
import { osMajorVersion } from "app/utils/platformUtil"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Platform } from "react-native"

jest.mock("app/Scenes/Onboarding/Auth2/hooks/useAuthNavigation", () => ({
  useAuthNavigation: jest.fn(),
}))

jest.mock("app/Scenes/Onboarding/Auth2/hooks/useInputAutofocus", () => ({
  useInputAutofocus: jest.fn(),
}))

const mockOSMajorVersion = osMajorVersion as jest.Mock

jest.mock("app/utils/platformUtil", () => ({
  osMajorVersion: jest.fn(),
}))

describe("LoginWelcomeStep", () => {
  beforeEach(() => {
    /**
     * This component involves animations, so we need to mock timers to ensure that the animations
     * are completed before making assertions.
     */
    jest.useFakeTimers()

    // Use iOS as the default platform to avoid having to mock the platform in every test.
    Platform.OS = "ios"
    mockOSMajorVersion.mockReturnValue(13)
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it("expands the modal when the input field is tapped", async () => {
    renderWithWrappers(
      <AuthContext.Provider>
        <LoginWelcomeStep />
      </AuthContext.Provider>
    )

    jest.advanceTimersByTime(400)

    expect(screen.queryByA11yHint("Go back to the previous screen")).not.toBeOnTheScreen()
    expect(screen.queryByA11yHint("Continue to the next screen")).not.toBeOnTheScreen()
    expect(screen.getByTestId("social-signin-and-disclaimers")).toHaveAnimatedStyle({ opacity: 1 })

    fireEvent(screen.getByA11yHint("Enter your email address"), "focus")

    jest.advanceTimersByTime(1000)

    expect(screen.getByA11yHint("Go back to the previous screen")).toBeOnTheScreen()
    expect(screen.getByA11yHint("Continue to the next screen")).toBeOnTheScreen()
    expect(screen.queryByTestId("social-signin-and-disclaimers")).not.toBeOnTheScreen()
  })

  describe("when the modal is expanded", () => {
    it("closes the modal when the back icon is tapped", () => {})
    it("navigates to the sign-up password step if a user account doesn't exist", () => {})
    it("navigates to the login password step if a user account exists", () => {})
  })

  it("shows the Sign in with Apple button on iOS versions >= 13 ", () => {
    renderWithWrappers(
      <AuthContext.Provider>
        <LoginWelcomeStep />
      </AuthContext.Provider>
    )

    jest.advanceTimersByTime(400)

    expect(screen.getByA11yHint("Sign in with Apple")).toBeOnTheScreen()
  })

  it("shows the Sign in with Apple button on iOS versions < 13", () => {
    mockOSMajorVersion.mockReturnValue(12)

    renderWithWrappers(
      <AuthContext.Provider>
        <LoginWelcomeStep />
      </AuthContext.Provider>
    )

    jest.advanceTimersByTime(400)

    expect(screen.queryByA11yHint("Sign in with Apple")).not.toBeOnTheScreen()
  })

  it("hides the Sign in with Apple button on Android", () => {
    Platform.OS = "android"

    renderWithWrappers(
      <AuthContext.Provider>
        <LoginWelcomeStep />
      </AuthContext.Provider>
    )

    jest.advanceTimersByTime(400)

    expect(screen.queryByA11yHint("Sign in with Apple")).not.toBeOnTheScreen()
  })

  it("initiates Sign in with Apple flow when the Apple icon is tapped", () => {})
  it("initiates Google Sign-In flow when the Google icon is tapped", () => {})
  it("initiates Facebook Login flow when the Facebook icon is tapped", () => {})
  it("provides a link to the terms and conditions", () => {})
  it("provides a link to the privacy policy", () => {})
})
