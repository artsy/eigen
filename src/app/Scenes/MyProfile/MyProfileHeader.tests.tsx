import { fireEvent, screen } from "@testing-library/react-native"
import { MyProfileHeaderTestQuery } from "__generated__/MyProfileHeaderTestQuery.graphql"
import { MyProfileHeader } from "app/Scenes/MyProfile/MyProfileHeader"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("MyProfileHeader", () => {
  const { renderWithRelay } = setupTestWrapper<MyProfileHeaderTestQuery>({
    Component: ({ me }) => <MyProfileHeader data={me as any} />,
    query: graphql`
      query MyProfileHeaderTestQuery @relay_test_operation {
        me {
          ...MyProfileHeader_me
        }
      }
    `,
  })

  it("Header Settings onPress navigates to my profile edit", () => {
    renderWithRelay()
    const profileImage = screen.getByTestId("profile-image")

    expect(profileImage).toBeTruthy()
    fireEvent.press(profileImage)
    expect(navigate).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith("/my-profile/edit", {
      passProps: { onSuccess: expect.anything() },
    })
  })

  it("Header shows the right text", async () => {
    renderWithRelay({
      Me: () => ({
        name: "My Name",
        createdAt: new Date().toISOString(),
        bio: "My Bio",
        icon: {
          url: "https://someurll.jpg",
        },
      }),
    })
    const year = new Date().getFullYear()

    expect(screen.getByText("My Name")).toBeOnTheScreen()
    expect(screen.getByText(`Member since ${year}`)).toBeOnTheScreen()
    expect(screen.getByText("My Bio")).toBeOnTheScreen()
  })

  it("renders Collector Profile info", async () => {
    renderWithRelay({
      Me: () => ({
        name: "Princess",
        createdAt: new Date("12/12/12").toISOString(),
        bio: "Richest Collector! 💰",
        location: {
          display: "Atlantis",
        },
        profession: "Guardian of the Galaxy",
        otherRelevantPositions: "Marvel Universe",
      }),
    })

    expect(screen.getByText("Guardian of the Galaxy")).toBeOnTheScreen()
    expect(screen.getByText("Atlantis")).toBeOnTheScreen()
    expect(screen.getByText("Marvel Universe")).toBeOnTheScreen()
  })

  describe("new settings screen", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableNewCollectorSettings: true })
    })

    it("renders new settings screen", async () => {
      renderWithRelay({
        Me: () => ({
          name: "Collector Collectorson",
          location: {
            display: "The Shire, Farthing",
          },
          counts: {
            followedArtists: 1,
            savedArtworks: 2,
            savedSearches: 3,
          },
        }),
      })

      expect(screen.getByText("The Shire, Farthing")).toBeOnTheScreen()
      expect(screen.getByText("1")).toBeOnTheScreen()
      expect(screen.getByText("Follow")).toBeOnTheScreen()
      expect(screen.getByText("2")).toBeOnTheScreen()
      expect(screen.getByText("Saves")).toBeOnTheScreen()
      expect(screen.getByText("3")).toBeOnTheScreen()
      expect(screen.getByText("Alerts")).toBeOnTheScreen()
    })

    it("navigates to the other screens from the links", () => {
      renderWithRelay()

      fireEvent.press(screen.getByText("Follows"))
      expect(navigate).toHaveBeenLastCalledWith("favorites")

      fireEvent.press(screen.getByText("Saves"))
      expect(navigate).toHaveBeenLastCalledWith("settings/saves")

      fireEvent.press(screen.getByText("Alerts"))
      expect(navigate).toHaveBeenLastCalledWith("settings/alerts")
    })
  })
})
