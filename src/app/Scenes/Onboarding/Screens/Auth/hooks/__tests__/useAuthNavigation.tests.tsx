import {
  useAuthNavigation,
  useAuthScreen,
} from "app/Scenes/Onboarding/Screens/Auth/hooks/useAuthNavigation"

jest.mock("app/Scenes/Onboarding/Screens/Auth/hooks/useAuthNavigation")

describe("useAuthNavigation", () => {
  const mockUseAuthNavigation = useAuthNavigation as jest.Mock
  const mockUseAuthScreen = useAuthScreen as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuthNavigation.mockReturnValue({
      goBack: jest.fn(),
      navigate: jest.fn(),
      setParams: jest.fn(),
    })
    mockUseAuthScreen.mockReturnValue({
      name: "SignUpPasswordStep",
      params: { email: "foo@bar.baz" },
    })
  })

  describe("useAuthNavigation", () => {
    it("returns a function to navigate to the previous screen", () => {
      const { goBack } = useAuthNavigation()
      goBack()
      expect(mockUseAuthNavigation().goBack).toHaveBeenCalled()
    })

    it("returns a function to navigate to a given screen", () => {
      const { navigate } = useAuthNavigation()
      navigate({ name: "SignUpNameStep", params: { email: "foo@bar.baz", password: "qux" } }) //pragma: allowlist secret
      expect(mockUseAuthNavigation().navigate).toHaveBeenCalledWith({
        name: "SignUpNameStep",
        params: { email: "foo@bar.baz", password: "qux" }, // pragma: allowlist secret
      })
    })

    it("returns a function to set params on the current screen ", () => {
      const { setParams } = useAuthNavigation()
      setParams({ email: "foo@bar.baz" })
      expect(mockUseAuthNavigation().setParams).toHaveBeenCalledWith({ email: "foo@bar.baz" })
    })
  })

  describe("useAuthScreen", () => {
    it("returns the current screen name and params", () => {
      const { name, params } = useAuthScreen()
      expect(name).toBe("SignUpPasswordStep")
      expect(params).toEqual({ email: "foo@bar.baz" })
    })
  })
})
