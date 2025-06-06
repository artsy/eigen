import { screen } from "@testing-library/react-native"
import { PartnerFollowButtonTestQuery } from "__generated__/PartnerFollowButtonTestQuery.graphql"
import { PartnerFollowButtonFragmentContainer } from "app/Scenes/Partner/Components/PartnerFollowButton"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("PartnerFollowButton", () => {
  const { renderWithRelay } = setupTestWrapper<PartnerFollowButtonTestQuery>({
    Component: ({ partner }) => <PartnerFollowButtonFragmentContainer partner={partner!} />,
    query: graphql`
      query PartnerFollowButtonTestQuery @relay_test_operation {
        partner(id: "white-cube") {
          ...PartnerFollowButton_deprecated_partner
        }
      }
    `,
  })

  it("renders the followers count correctly", async () => {
    renderWithRelay({
      Partner: () => ({
        hasVisibleFollowsCount: true,
        profile: {
          name: "White Cube",
          isFollowed: true,
          counts: {
            follows: 670,
          },
        },
      }),
    })

    expect(screen.getByText(/Following 670/)).toBeOnTheScreen()
  })

  it("renders without followers count correctly", async () => {
    renderWithRelay({
      Partner: () => ({
        hasVisibleFollowsCount: false,
        profile: {
          name: "White Cube",
          isFollowed: true,
        },
      }),
    })

    expect(screen.getByText(/Following/)).toBeOnTheScreen()
  })

  it("renders button state correctly", async () => {
    renderWithRelay({
      Partner: () => ({
        profile: {
          name: "White Cube",
          isFollowed: false,
          counts: null,
        },
      }),
    })

    expect(screen.getByText(/Follow/)).toBeOnTheScreen()
  })
})
