import { fireEvent, screen } from "@testing-library/react-native"
import { MyAccountTestsQuery } from "__generated__/MyAccountTestsQuery.graphql"
import { MyAccount } from "app/Scenes/MyAccount/MyAccount"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Platform } from "react-native"
import { graphql } from "react-relay"

const mockUnlinkFB = jest.fn()
const mocklinkFB = jest.fn()

const mockedUseFBLinks = {
  link: mocklinkFB,
  unlink: mockUnlinkFB,
  linkUsingOauthToken: jest.fn(),
}

jest.mock("app/utils/LinkedAccounts/facebook", () => ({
  useFacebookLink: jest.fn(() => mockedUseFBLinks),
}))

const mockUnlinkGoogle = jest.fn()
const mocklinkGoogle = jest.fn()

const mockedUseGoogleLinks = {
  link: mocklinkGoogle,
  unlink: mockUnlinkGoogle,
  linkUsingOauthToken: jest.fn(),
}

jest.mock("app/utils/LinkedAccounts/google", () => ({
  useGoogleLink: jest.fn(() => mockedUseGoogleLinks),
}))

describe("MyAccountQueryRenderer", () => {
  const { renderWithRelay } = setupTestWrapper<MyAccountTestsQuery>({
    Component: (props) => {
      if (!props.me) {
        return null
      }

      return <MyAccount me={props.me} />
    },
    query: graphql`
      query MyAccountTestsQuery {
        me @required(action: NONE) {
          ...MyAccount_me
        }
      }
    `,
  })

  it("shows email", () => {
    renderWithRelay({
      Me: () => ({
        email:
          "myverylongemailmyverylongemailmyverylongemail@averylongdomainaverylongdomainaverylongdomain.com",
        phone: "123",
        priceRange: "-1:2500",
        paddleNumber: "321",
        hasPassword: true,
      }),
    })

    expect(
      screen.getByText(
        "myverylongemailmyverylongemailmyverylongemail@averylongdomainaverylongdomainaverylongdomain.com"
      )
    ).toBeOnTheScreen()
  })

  describe("When ShowLinkedAccounts", () => {
    it("Shows linked accounts section when user does not have 2FA enabled AND has linked accounts", () => {
      renderWithRelay({
        Me: () => ({
          email: "email@gmail.com",
          phone: "123",
          priceRange: "-1:2500",
          paddleNumber: "321",
          hasPassword: true,
          secondFactors: [],
          authentications: [{ provider: "FACEBOOK" }],
        }),
      })

      expect(screen.getByText("Linked Accounts")).toBeOnTheScreen()
    })

    describe("Link Accounts Menu Items", () => {
      afterEach(() => {
        jest.clearAllMocks()
      })

      it("links when **not** previously linked and unlinks when previously linked", () => {
        Platform.OS = "ios"

        renderWithRelay({
          Me: () => ({
            email: "email@gmail.com",
            phone: "123",
            priceRange: "-1:2500",
            paddleNumber: "321",
            secondFactors: [],
            hasPassword: true,
            // user has only linked facebook
            authentications: [{ provider: "FACEBOOK" }],
          }),
        })

        const fblinkItem = screen.getByText("Facebook")
        const googlelinkItem = screen.getByText("Google")

        fireEvent(fblinkItem, "onPress")
        expect(mockUnlinkFB).toHaveBeenCalled()

        fireEvent(googlelinkItem, "onPress")
        expect(mockUnlinkGoogle).not.toHaveBeenCalled()
      })

      it("user cannot unlink their only authentication method", () => {
        renderWithRelay({
          Me: () => ({
            email: "email@gmail.com",
            phone: "123",
            priceRange: "-1:2500",
            paddleNumber: "321",
            secondFactors: [],
            // user does not have email/password, but has only FB as auth method
            hasPassword: false,
            authentications: [{ provider: "FACEBOOK" }],
          }),
        })

        const fblinkItem = screen.getByText("Facebook")

        fireEvent(fblinkItem, "onPress")

        expect(mockUnlinkFB).not.toHaveBeenCalled()
      })
    })
  })
})
