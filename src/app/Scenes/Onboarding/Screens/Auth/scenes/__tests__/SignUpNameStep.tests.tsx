import { fireEvent, screen } from "@testing-library/react-native"
import {
  AuthContext,
  defaultState,
} from "app/Scenes/Onboarding/Screens/Auth/AuthContext"
import { useCountryCode } from "app/Scenes/Onboarding/Screens/Auth/hooks/useCountryCode"
import { SignUpNameStep } from "app/Scenes/Onboarding/Screens/Auth/scenes/SignUpNameStep"
import { GlobalStore } from "app/store/GlobalStore"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("@artsy/palette-mobile", () => ({
  ...jest.requireActual("@artsy/palette-mobile"),
  useTheme: jest.fn().mockReturnValue({
    color: jest.fn(),
  }),
}))

jest.mock("app/Scenes/Onboarding/Screens/Auth/hooks/useCountryCode", () => ({
  useCountryCode: jest.fn().mockReturnValue({
    loading: false,
    isAutomaticallySubscribed: false,
  }),
}))

jest.mock("app/Scenes/Onboarding/Screens/Auth/hooks/useAuthNavigation", () => ({
  useAuthNavigation: jest.fn(),
  useAuthScreen: jest.fn().mockReturnValue({
    currentScreen: "SignUpNameStep",
  }),
}))

const mockUseCountryCode = useCountryCode as jest.Mock

describe("SignUpNameStep", () => {
  it("renders the full name input", () => {
    renderWithWrappers(
      <AuthContext.Provider>
        <SignUpNameStep />
      </AuthContext.Provider>
    )

    expect(screen.getByA11yHint("Enter your full name")).toBeTruthy()
  })

  it("renders the terms and privacy policy checkbox", () => {
    renderWithWrappers(
      <AuthContext.Provider>
        <SignUpNameStep />
      </AuthContext.Provider>
    )

    expect(
      screen.getByA11yHint("Check this element to accept Artsy's terms and privacy policy")
    ).toBeTruthy()
  })

  it("renders the email subscription checkbox", () => {
    renderWithWrappers(
      <AuthContext.Provider>
        <SignUpNameStep />
      </AuthContext.Provider>
    )

    expect(screen.getByA11yHint("Check this element to receive Artsy's emails")).toBeTruthy()
  })

  describe("user is automatically subscribed", () => {
    beforeEach(() => {
      mockUseCountryCode.mockReturnValue({
        loading: false,
        isAutomaticallySubscribed: true,
      })
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("does not render the email opt-in checkbox if the user is automatically subscribed", () => {
      renderWithWrappers(
        <AuthContext.Provider
          runtimeModel={{ ...defaultState, isAutomaticallySubscribed: true }}
        >
          <SignUpNameStep />
        </AuthContext.Provider>
      )

      expect(screen.queryByA11yHint("Check this element to receive Artsy's emails")).toBeNull()
    })

    it("agrees to receive emails if the user is automatically ", async () => {
      const mockSignUp = jest
        .spyOn(GlobalStore.actions.auth, "signUp")
        // @ts-expect-error
        .mockImplementation(() => Promise.resolve())

      renderWithWrappers(
        <AuthContext.Provider
          runtimeModel={{ ...defaultState, isAutomaticallySubscribed: true }}
        >
          <SignUpNameStep />
        </AuthContext.Provider>
      )

      fireEvent.changeText(screen.getByA11yHint("Enter your full name"), "Percy Cat")
      fireEvent.press(
        screen.getByA11yHint("Check this element to accept Artsy's terms and privacy policy")
      )

      fireEvent.press(screen.getByText("Continue"))

      await flushPromiseQueue()

      expect(mockSignUp).toHaveBeenCalled()
    })
  })
})
