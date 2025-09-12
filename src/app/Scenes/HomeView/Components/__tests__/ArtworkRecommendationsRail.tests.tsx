import { screen } from "@testing-library/react-native"
import { ArtworkRecommendationsRailTestsQuery } from "__generated__/ArtworkRecommendationsRailTestsQuery.graphql"
import { ArtworkRecommendationsRail } from "app/Scenes/HomeView/Components/ArtworkRecommendationsRail"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtworkRecommendationsRail", () => {
  const { renderWithRelay } = setupTestWrapper<ArtworkRecommendationsRailTestsQuery>({
    Component: ({ me }) => {
      return (
        <ArtworkRecommendationsRail
          scrollRef={null}
          title="Recommended Artworks"
          me={me!}
          isRailVisible
        />
      )
    },
    query: graphql`
      query ArtworkRecommendationsRailTestsQuery @raw_response_type {
        me {
          ...ArtworkRecommendationsRail_me
        }
      }
    `,
  })

  it("Renders list of recommended artworks without throwing an error", async () => {
    renderWithRelay({
      Me: () => mockMe,
    })

    expect(screen.getByText("Nicolas Party")).toBeTruthy()
    expect(screen.getByText("Andy Warhol")).toBeTruthy()
  })
})

const mockMe = {
  artworkRecommendations: {
    edges: [
      {
        node: {
          href: "/artwork/nicolas-party-rocks-ii",
          internalID: "5deff4b96fz7e7000f36ce37",
          slug: "nicolas-party-rocks-ii",
          artistNames: "Nicolas Party",
          image: {
            imageURL: "https://d32dm0rphc51dk.cloudfront.net/Tc9k2ROn55SxNHWjYxxnrg/:version.jpg",
          },
          saleMessage: "$20,000",
        },
      },
      {
        node: {
          internalID: "5d14c764d2f1db001243a81e",
          slug: "nicolas-party-still-life-no-011",
          artistNames: "Andy Warhol",
          href: "/artwork/nicolas-party-still-life-no-011",
          saleMessage: "$25,000",
          image: {
            imageURL: "https://d32dm0rphc51dk.cloudfront.net/Tc9k2ROn55SxNHWjYxxnrg/:version.jpg",
          },
        },
      },
    ],
  },
}
