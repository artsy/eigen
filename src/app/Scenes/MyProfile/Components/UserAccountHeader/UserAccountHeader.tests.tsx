import { fireEvent, screen } from "@testing-library/react-native"
import { UserAccountHeaderTestQuery } from "__generated__/UserAccountHeaderTestQuery.graphql"
import { UserAccountHeader } from "app/Scenes/MyProfile/Components/UserAccountHeader/UserAccountHeader"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

// React-test-renderer has issues with memo components, so we need to mock the palette-mobile Image component
// Until it gets fixed
// See https://github.com/facebook/react/issues/17301
jest.mock("@artsy/palette-mobile", () => ({
  ...jest.requireActual("@artsy/palette-mobile"),
  Image: require("react-native").Image,
}))

describe("UserAccountHeader", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const { renderWithRelay } = setupTestWrapper<UserAccountHeaderTestQuery>({
    Component: ({ me }) => <UserAccountHeader meProps={me!} />,
    query: graphql`
      query UserAccountHeaderTestQuery @relay_test_operation {
        me {
          ...UserAccountHeader_me
        }
      }
    `,
  })

  it("renders user details", () => {
    renderWithRelay({
      Me: () => me,
    })
    expect(screen.getByText("some name")).toBeOnTheScreen()
    expect(screen.getByText("location")).toBeOnTheScreen()
    expect(screen.getByText("developer")).toBeOnTheScreen()
    expect(screen.getByText("other")).toBeOnTheScreen()
  })

  describe("identity verified icon", () => {
    it("is displayed when identity is verified", () => {
      renderWithRelay({
        Me: () => me,
      })

      expect(screen.getByTestId("identity-verified-icon")).toBeOnTheScreen()
    })

    it("is not displayed when identity is not verified", () => {
      renderWithRelay({
        Me: () => ({ ...me, isIdentityVerified: false }),
      })

      expect(screen.queryByTestId("identity-verified-icon")).not.toBeOnTheScreen()
    })
  })

  it("renders profile image", () => {
    renderWithRelay({
      Me: () => me,
    })
    const profileImage = screen.getByTestId("profile-image")

    expect(profileImage).toBeTruthy()
    expect(profileImage.props.src).toEqual("https://lala.cloudfront.net/lalala/thumbnail.jpg")
  })

  it("card press navigates to my-collection", () => {
    renderWithRelay()
    const profileCard = screen.getByTestId("account-card")

    expect(profileCard).toBeTruthy()
    fireEvent.press(profileCard)
    expect(navigate).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith("/my-collection")
  })

  it("on complete profile press navigates to the complete profile flow", () => {
    renderWithRelay({
      Me: () => ({ ...me, isIdentityVerified: false }),
    })
    const completeProfileButton = screen.getByTestId("complete-profile-button")

    expect(completeProfileButton).toBeTruthy()
    expect(screen.queryByTestId("identity-verified-icon")).not.toBeOnTheScreen()

    fireEvent.press(completeProfileButton)
    expect(navigate).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith("/complete-my-profile", { passProps: expect.any(Object) })
  })

  it("on view full profile press navigates to the full profile", () => {
    renderWithRelay({
      Me: () => me,
    })
    const viewFullProfileButton = screen.getByTestId("view-full-profile-button")

    expect(viewFullProfileButton).toBeTruthy()
    expect(screen.getByTestId("identity-verified-icon")).toBeOnTheScreen()
    fireEvent.press(viewFullProfileButton)
    expect(navigate).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith("/my-collection")
  })
})

const me = {
  name: "some name",
  location: {
    display: "location",
  },
  profession: "developer",
  icon: {
    url: "https://lala.cloudfront.net/lalala/thumbnail.jpg",
  },
  isIdentityVerified: true,
  otherRelevantPositions: "other",
}
