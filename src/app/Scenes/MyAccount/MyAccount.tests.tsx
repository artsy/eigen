import { MyAccountTestsQuery } from "__generated__/MyAccountTestsQuery.graphql"
import { MenuItem } from "app/Components/MenuItem"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { extractText } from "app/tests/extractText"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { Text } from "palette"
import { Platform } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { MyAccountContainer } from "./MyAccount"

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
  const TestRenderer = () => (
    <QueryRenderer<MyAccountTestsQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query MyAccountTestsQuery {
          me {
            ...MyAccount_me
          }
        }
      `}
      render={({ props, error }) => {
        if (props?.me) {
          return <MyAccountContainer me={props.me} />
        } else if (error) {
          console.log(error)
        }
      }}
      variables={{}}
    />
  )

  it("truncated long emails", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />).root
    resolveMostRecentRelayOperation({
      Me: () => ({
        name: "pavlos",
        email:
          "myverylongemailmyverylongemailmyverylongemail@averylongdomainaverylongdomainaverylongdomain.com",
        phone: "123",
        paddleNumber: "321",
        hasPassword: true,
      }),
    })

    expect(tree.findAllByType(Text)[4].props.children).toBe(
      "myverylongemailmyverylongemailmyverylongemail@averylongdomainaverylongdomainaverylongdomain.com"
    )
  })

  describe("When ShowLinkedAccounts", () => {
    it("Shows linked accounts section when user does not have 2FA enabled AND has linked accounts", () => {
      const tree = renderWithWrappersLEGACY(<TestRenderer />)
      resolveMostRecentRelayOperation({
        Me: () => ({
          name: "my name",
          email: "email@gmail.com",
          phone: "123",
          paddleNumber: "321",
          hasPassword: true,
          secondFactors: [],
          authentications: [{ provider: "FACEBOOK" }],
        }),
      })
      expect(extractText(tree.root)).toContain("LINKED ACCOUNTS")
    })

    describe("Link Accounts Menu Items", () => {
      afterEach(() => {
        jest.clearAllMocks()
      })

      it("links when **not** previously linked and unlinks when previously linked", () => {
        __globalStoreTestUtils__?.injectFeatureFlags({ ARGoogleAuth: true })
        Platform.OS = "ios"
        const tree = renderWithWrappersLEGACY(<TestRenderer />)
        resolveMostRecentRelayOperation({
          Me: () => ({
            name: "my name",
            email: "email@gmail.com",
            phone: "123",
            paddleNumber: "321",
            secondFactors: [],
            hasPassword: true,
            // user has only linked facebook
            authentications: [{ provider: "FACEBOOK" }],
          }),
        })
        const fblinkItem = tree.root.findAllByType(MenuItem)[5]
        const googlelinkItem = tree.root.findAllByType(MenuItem)[6]
        expect(fblinkItem.props.title).toBe("Facebook")
        expect(googlelinkItem.props.title).toBe("Google")

        fblinkItem.props.onPress()
        expect(mockUnlinkFB).toHaveBeenCalled()
        expect(mocklinkFB).not.toHaveBeenCalled()

        googlelinkItem.props.onPress()
        expect(mockUnlinkGoogle).not.toHaveBeenCalled()
        expect(mocklinkGoogle).toHaveBeenCalled()
      })

      it("user cannot unlink their only authentication method", () => {
        const tree = renderWithWrappersLEGACY(<TestRenderer />)
        resolveMostRecentRelayOperation({
          Me: () => ({
            name: "my name",
            email: "email@gmail.com",
            phone: "123",
            paddleNumber: "321",
            secondFactors: [],
            // user does not have email/password, but has only FB as auth method
            hasPassword: false,
            authentications: [{ provider: "FACEBOOK" }],
          }),
        })
        const fblinkItem = tree.root.findAllByType(MenuItem)[4]
        expect(fblinkItem.props.title).toEqual("Facebook")
        fblinkItem.props.onPress()
        expect(mockUnlinkFB).not.toHaveBeenCalled()
      })
    })
  })
})
