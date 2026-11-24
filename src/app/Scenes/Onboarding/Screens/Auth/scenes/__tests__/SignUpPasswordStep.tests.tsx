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
    await renderWithWrappers(<SignUpPasswordStep />)

    await fireEvent.changeText(screen.getByHintText("Enter your password"), "Password1")
    await fireEvent.press(screen.getByHintText("Continue to the next screen"))

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

  it("navigates back when back button is pressed", async () => {
    await renderWithWrappers(<SignUpPasswordStep />)
    await fireEvent.press(screen.getByHintText("Go back to the previous screen"))
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

    it("displays a login link", async () => {
      await renderWithWrappers(<SignUpPasswordStep />)
      expect(screen.getByHintText("Go to the login screen")).toBeDefined()
    })

    it("navigates to the login screen when the login link is pressed", async () => {
      await renderWithWrappers(<SignUpPasswordStep />)
      await fireEvent.press(screen.getByHintText("Go to the login screen"))
      expect(mockUseAuthNavigation().navigate).toHaveBeenCalledWith({
        name: "LoginPasswordStep",
        params: { email: "foo@bar.baz", showSignUpLink: true },
      })
    })
  })
})
