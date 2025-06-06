import { screen } from "@testing-library/react-native"
import { RecommendedArtistsRailTestsQuery } from "__generated__/RecommendedArtistsRailTestsQuery.graphql"
import { RecommendedArtistsRailFragmentContainer } from "app/Scenes/HomeView/Components/ArtistRails/RecommendedArtistsRail"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("RecommendedArtistsRail", () => {
  const { renderWithRelay } = setupTestWrapper<RecommendedArtistsRailTestsQuery>({
    Component: ({ me }) => {
      if (!me) {
        return null
      }
      return (
        <RecommendedArtistsRailFragmentContainer
          me={me}
          scrollRef={null}
          title="Recommended Artists"
        />
      )
    },
    query: graphql`
      query RecommendedArtistsRailTestsQuery @relay_test_operation {
        me {
          ...RecommendedArtistsRail_me
        }
      }
    `,
  })

  it("Renders list of recommended artists without throwing an error", async () => {
    renderWithRelay({ Me: () => mockMe })

    expect(screen.getByText("Rhombie Sandoval")).toBeTruthy()
    expect(screen.getByText("Mexican-American, b. 1991")).toBeTruthy()
  })

  it("returns null if there are no artists", async () => {
    const { toJSON } = renderWithRelay({ Me: () => emptyMe })

    expect(toJSON()).toBeNull()
  })
})

const emptyMe = {
  artistRecommendations: {
    edges: [],
  },
}
const mockMe = {
  artistRecommendations: {
    edges: [
      {
        node: {
          name: "Rhombie Sandoval",
          id: "QXJ0aXN0OjVmMTEyYzU4NzZlZmRhMDAwZTY4ZjNhOQ==",
          slug: "rhombie-sandoval",
          internalID: "5f112c5876efda000e68f3a9",
          href: "/artist/rhombie-sandoval",
          formattedNationalityAndBirthday: "Mexican-American, b. 1991",
          image: { url: "https://d32dm0rphc51dk.cloudfront.net/9fBwpcL2aMa2YyBEzol8Yg/square.jpg" },
          basedOn: null,
          isFollowed: false,
        },
      },
    ],
  },
}
