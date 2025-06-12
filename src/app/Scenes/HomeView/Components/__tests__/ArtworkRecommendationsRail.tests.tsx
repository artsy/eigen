import { ArtworkRecommendationsRailTestsQuery } from "__generated__/ArtworkRecommendationsRailTestsQuery.graphql"
import { ArtworkRecommendationsRail } from "app/Scenes/HomeView/Components/ArtworkRecommendationsRail"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { graphql, useLazyLoadQuery } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

describe("ArtworkRecommendationsRail", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer: React.FC = () => {
    const queryData = useLazyLoadQuery<ArtworkRecommendationsRailTestsQuery>(
      graphql`
        query ArtworkRecommendationsRailTestsQuery @raw_response_type {
          me {
            ...ArtworkRecommendationsRail_me
          }
        }
      `,
      {}
    )

    return (
      <ArtworkRecommendationsRail
        scrollRef={null}
        title="Recommended Artworks"
        me={queryData.me!}
        isRailVisible
      />
    )
  }

  const getWrapper = async () => {
    const tree = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    act(() => {
      mockEnvironment.mock.resolveMostRecentOperation({
        errors: [],
        data: { me: mockMe },
      })
    })

    await flushPromiseQueue()

    return tree
  }

  it("Renders list of recommended artworks without throwing an error", async () => {
    const { queryByText } = await getWrapper()

    expect(queryByText("Nicolas Party")).toBeTruthy()
    expect(queryByText("Andy Warhol")).toBeTruthy()
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
