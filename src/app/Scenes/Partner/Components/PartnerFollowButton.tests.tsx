import { PartnerFollowButtonTestQuery } from "__generated__/PartnerFollowButtonTestQuery.graphql"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { PartnerFollowButtonFragmentContainer } from "./PartnerFollowButton"

describe("PartnerFollowButton", () => {
  const { renderWithRelay } = setupTestWrapper<PartnerFollowButtonTestQuery>({
    Component: ({ partner }) => <PartnerFollowButtonFragmentContainer partner={partner!} />,
    query: graphql`
      query PartnerFollowButtonTestQuery @relay_test_operation {
        partner(id: "white-cube") {
          ...PartnerFollowButton_partner
        }
      }
    `,
  })

  it("renders the followers count correctly", async () => {
    const { queryByText } = renderWithRelay({
      Partner: () => ({
        profile: {
          name: "White Cube",
          isFollowed: true,
          counts: {
            follows: 670,
          },
        },
      }),
    })

    expect(queryByText(/Following 670/)).toBeOnTheScreen()
  })

  it("renders without followers count correctly", async () => {
    const { queryByText } = renderWithRelay({
      Partner: () => ({
        profile: {
          name: "White Cube",
          isFollowed: true,
          counts: {
            follows: 499,
          },
        },
      }),
    })

    expect(queryByText(/Following/)).toBeOnTheScreen()
  })

  it("renders button state correctly", async () => {
    const { queryByText } = renderWithRelay({
      Partner: () => ({
        profile: {
          name: "White Cube",
          isFollowed: false,
          counts: null,
        },
      }),
    })

    expect(queryByText(/Follow/)).toBeOnTheScreen()
  })
})
