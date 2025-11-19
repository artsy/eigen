import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import {
  useAuthNavigation,
  useAuthScreen,
} from "app/Scenes/Onboarding/Screens/Auth/hooks/useAuthNavigation"
import { SignUpPasswordStep } from "app/Scenes/Onboarding/Screens/Auth/scenes/SignUpPasswordStep"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/Scenes/Onboarding/Screens/Auth/hooks/useAuthNavigation", () => ({
  useAuthNavigation: jest.fn().mockReturnValue({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useAuthScreen: jest.fn().mockReturnValue({
    name: "SignUpPasswordStep",
    params: {
      email: "foo@bar.baz",
    },
  }),
}))

describe("SignUpPasswordStep", () => {
  const mockUseAuthNavigation = useAuthNavigation as jest.Mock
  const mockUseAuthScreen = useAuthScreen as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("navigates to the next step when a valid password is entered", async () => {
    renderWithWrappers(<SignUpPasswordStep />)

    fireEvent.changeText(screen.getByA11yHint("Enter your password"), "Password1")
    fireEvent.press(screen.getByA11yHint("Continue to the next screen"))

    await waitFor(() => {
      expect(mockUseAuthNavigation().navigate).toHaveBeenCalledWith({
        name: "SignUpNameStep",
        params: {
          email: "foo@bar.baz",
          password: "Password1", // pragma: allowlist secret
        },
      })
    })
  })

  it("navigates back when back button is pressed", () => {
    renderWithWrappers(<SignUpPasswordStep />)
    fireEvent.press(screen.getByA11yHint("Go back to the previous screen"))
    expect(mockUseAuthNavigation().goBack).toHaveBeenCalled()
  })

  describe("when showLoginLink param is true", () => {
    beforeEach(() => {
      mockUseAuthScreen.mockReturnValue({
        name: "SignUpPasswordStep",
        params: {
          email: "foo@bar.baz",
          showLoginLink: true,
        },
      })
    })

    it("displays a login link", () => {
      renderWithWrappers(<SignUpPasswordStep />)
      expect(screen.getByA11yHint("Go to the login screen")).toBeDefined()
    })

    it("navigates to the login screen when the login link is pressed", () => {
      renderWithWrappers(<SignUpPasswordStep />)
      fireEvent.press(screen.getByA11yHint("Go to the login screen"))
      expect(mockUseAuthNavigation().navigate).toHaveBeenCalledWith({
        name: "LoginPasswordStep",
        params: { email: "foo@bar.baz", showSignUpLink: true },
      })
    })
  })
})
