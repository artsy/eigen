import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { useCountryCode } from "app/Scenes/Onboarding/Auth2/hooks/useCountryCode"
import { SignUpNameStep } from "app/Scenes/Onboarding/Auth2/scenes/SignUpNameStep"
import { GlobalStore } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("@artsy/palette-mobile", () => ({
  ...jest.requireActual("@artsy/palette-mobile"),
  useTheme: jest.fn().mockReturnValue({
    color: jest.fn(),
  }),
}))

const mockUseCountryCode = useCountryCode as jest.Mock

jest.mock("app/Scenes/Onboarding/Auth2/hooks/useCountryCode", () => ({
  useCountryCode: jest.fn().mockReturnValue({
    loading: false,
    isAutomaticallySubscribed: false,
  }),
}))

jest.mock("app/Scenes/Onboarding/Auth2/hooks/useAuthNavigation", () => ({
  useAuthNavigation: jest.fn(),
  useAuthScreen: jest.fn().mockReturnValue({
    currentScreen: "SignUpNameStep",
  }),
}))

jest.mock("app/store/GlobalStore", () => ({
  ...jest.requireActual("app/store/GlobalStore"),
  GlobalStore: {
    ...jest.requireActual("app/store/GlobalStore").GlobalStore,
    actions: {
      auth: {
        signUp: jest.fn(),
      },
    },
  },
}))

describe("SignUpNameStep", () => {
  it("renders the full name input", () => {
    renderWithWrappers(<SignUpNameStep />)

    expect(screen.getByA11yHint("Enter your full name")).toBeTruthy()
  })

  it("renders the terms and privacy policy checkbox", () => {
    renderWithWrappers(<SignUpNameStep />)

    expect(
      screen.getByA11yHint("Check this element to accept Artsy's terms and privacy policy")
    ).toBeTruthy()
  })

  it("renders the email subscription checkbox", () => {
    renderWithWrappers(<SignUpNameStep />)

    expect(screen.getByA11yHint("Check this element to receive Artsy's emails")).toBeTruthy()
  })

  describe("user is automatically subscribed", () => {
    beforeEach(() => {
      mockUseCountryCode.mockReturnValue({
        isAutomaticallySubscribed: true,
      })
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("does not render the email opt-in checkbox if the user is automatically subscribed", () => {
      renderWithWrappers(<SignUpNameStep />)

      expect(screen.queryByA11yHint("Check this element to receive Artsy's emails")).toBeNull()
    })

    it("agrees to receive emails if the user is automatically ", async () => {
      renderWithWrappers(<SignUpNameStep />)

      fireEvent.changeText(screen.getByA11yHint("Enter your full name"), "Percy Cat")
      fireEvent.press(
        screen.getByA11yHint("Check this element to accept Artsy's terms and privacy policy")
      )

      fireEvent.press(screen.getByText("Continue"))

      await waitFor(() => {
        expect(GlobalStore.actions.auth.signUp).toHaveBeenCalledWith(
          expect.objectContaining({
            agreedToReceiveEmails: true,
          })
        )
      })
    })
  })
})
