import { fireEvent, screen } from "@testing-library/react-native"
import { FairEditorialTestsQuery } from "__generated__/FairEditorialTestsQuery.graphql"
import { FairEditorialFragmentContainer } from "app/Scenes/Fair/Components/FairEditorial"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("FairEditorial", () => {
  const { renderWithRelay } = setupTestWrapper<FairEditorialTestsQuery>({
    Component: ({ fair }) => <FairEditorialFragmentContainer fair={fair!} />,
    query: graphql`
      query FairEditorialTestsQuery($fairID: String!) {
        fair(id: $fairID) {
          ...FairEditorial_fair
        }
      }
    `,
    variables: { fairID: "art-basel-hong-kong-2020" },
  })

  it("renders the 2 articles", () => {
    renderWithRelay({
      Fair: () => ({
        articles: {
          totalCount: 2,
          edges: [
            {
              node: {
                title: "What Sold at Art Basel in Hong Kong’s Online Viewing Rooms",
              },
            },
            {
              node: {
                title: "In the Midst of COVID-19, Chinese Galleries Adapt and Persevere",
              },
            },
          ],
        },
      }),
    })

    expect(
      screen.getByText("What Sold at Art Basel in Hong Kong’s Online Viewing Rooms")
    ).toBeOnTheScreen()
    expect(
      screen.getByText("In the Midst of COVID-19, Chinese Galleries Adapt and Persevere")
    ).toBeOnTheScreen()
  })

  it("renders null if there are no articles", () => {
    renderWithRelay({
      Fair: () => ({
        articles: {
          edges: [],
        },
      }),
    })

    expect(screen.toJSON()).toBeNull()
  })

  it("tracks article taps", () => {
    renderWithRelay({
      Fair: () => ({
        internalID: "def123",
        slug: "art-basel-hong-kong-2020",
        articles: {
          totalCount: 2,
          edges: [
            {
              node: {
                title: "What Sold at Art Basel in Hong Kong’s Online Viewing Rooms",
                internalID: "xyz123",
                slug: "artsy-editorial-sold-art-basel-hong-kongs-online-viewing-rooms",
              },
            },
          ],
        },
      }),
    })

    const article = screen.getByText("What Sold at Art Basel in Hong Kong’s Online Viewing Rooms")
    fireEvent.press(article)

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedArticleGroup",
      context_module: "relatedArticles",
      context_screen_owner_type: "fair",
      context_screen_owner_id: "def123",
      context_screen_owner_slug: "art-basel-hong-kong-2020",
      destination_screen_owner_type: "article",
      destination_screen_owner_id: "xyz123",
      destination_screen_owner_slug:
        "artsy-editorial-sold-art-basel-hong-kongs-online-viewing-rooms",
      type: "thumbnail",
    })
  })
})
