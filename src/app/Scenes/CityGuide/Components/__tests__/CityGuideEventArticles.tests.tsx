import { fireEvent, screen } from "@testing-library/react-native"
import { CityGuideEventArticlesTestQuery } from "__generated__/CityGuideEventArticlesTestQuery.graphql"
import { CityGuideEventArticles } from "app/Scenes/CityGuide/Components/CityGuideEventArticles"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

// React-test-renderer has issues with memo components, so we need to mock the palette-mobile
// Image component. See https://github.com/facebook/react/issues/17301
jest.mock("@artsy/palette-mobile", () => ({
  ...jest.requireActual("@artsy/palette-mobile"),
  Image: require("react-native").Image,
}))

describe("CityGuideEventArticles", () => {
  const { renderWithRelay } = setupTestWrapper<CityGuideEventArticlesTestQuery>({
    Component: (props: any) => (
      <CityGuideEventArticles {...props} citySlug="london-united-kingdom" />
    ),
    query: graphql`
      query CityGuideEventArticlesTestQuery($citySlug: String!, $first: Int!)
      @relay_test_operation {
        city(slug: $citySlug) {
          ...CityGuideEventArticles_city @arguments(first: $first)
        }
      }
    `,
    variables: { citySlug: "london-united-kingdom", first: 10 },
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const article = (title: string, position = 0, overrides: object = {}) => ({
    internalID: `attachment-for-${title}`,
    position,
    article: {
      internalID: `id-for-${title}`,
      slug: `slug-for-${title}`,
      title: `${title} (headline)`,
      thumbnailTitle: title,
      byline: "Natalie Stoclet",
      href: `/article/${title}`,
      publishedAt: "July 19, 2026",
      thumbnailImage: { url: "https://example.com/article-thumb.jpg" },
      ...overrides,
    },
  })

  const event = (articles: object[]) => ({
    internalID: "id-for-london-art-week",
    articles,
  })

  const connection = (eventNodes: object[]) => ({
    CityGuideEventsConnection: () => ({ edges: eventNodes.map((node) => ({ node })) }),
  })

  it("renders the static, unpressable section title", async () => {
    renderWithRelay(connection([event([article("An Art Lover's Guide to London")])]))

    expect(await screen.findByText("Artsy Editorial")).toBeOnTheScreen()
    expect(screen.queryByTestId("touchable-wrapper")).not.toBeOnTheScreen()
  })

  it("renders each article's thumbnail, title, byline and date", async () => {
    renderWithRelay(connection([event([article("An Art Lover's Guide to London")])]))

    expect(await screen.findByTestId("event-article-image")).toHaveProp(
      "src",
      "https://example.com/article-thumb.jpg"
    )
    // The link title Positron wants shown, not the longer in-article headline.
    expect(screen.getByText("An Art Lover's Guide to London")).toBeOnTheScreen()
    expect(screen.queryByText("An Art Lover's Guide to London (headline)")).not.toBeOnTheScreen()
    expect(screen.getByText("By Natalie Stoclet")).toBeOnTheScreen()
    expect(screen.getByText("July 19, 2026")).toBeOnTheScreen()
  })

  it("orders rows by the attachment's position, not the order the field returned", async () => {
    renderWithRelay(
      connection([
        event([
          article("10 Exhibitions to see in London this summer", 1),
          article("An Art Lover's Guide to London", 0),
        ]),
      ])
    )

    const rows = await screen.findAllByTestId("event-article-row")

    expect(rows).toHaveLength(2)
    expect(rows[0]).toContainElement(screen.getByText("An Art Lover's Guide to London"))
  })

  it("navigates to the article when a row is tapped", async () => {
    renderWithRelay(connection([event([article("An Art Lover's Guide to London")])]))

    fireEvent.press((await screen.findAllByTestId("event-article-row"))[0])

    expect(navigate).toHaveBeenCalledWith("/article/An Art Lover's Guide to London")
  })

  it("tracks the tap on an article row", async () => {
    renderWithRelay(connection([event([article("An Art Lover's Guide to London")])]))

    fireEvent.press((await screen.findAllByTestId("event-article-row"))[0])

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "tappedArticleGroup",
        context_module: "articles",
        context_screen_owner_type: "cityGuide",
        context_screen_owner_slug: "london-united-kingdom",
        destination_screen_owner_type: "article",
        destination_screen_owner_id: "id-for-An Art Lover's Guide to London",
        destination_screen_owner_slug: "slug-for-An Art Lover's Guide to London",
      })
    )
  })

  it("falls back to a placeholder for an article with no thumbnail", async () => {
    renderWithRelay(
      connection([event([article("An Art Lover's Guide to London", 0, { thumbnailImage: null })])])
    )

    expect(await screen.findByTestId("event-article-no-image")).toBeOnTheScreen()
    expect(screen.queryByTestId("event-article-image")).not.toBeOnTheScreen()
  })

  it("renders rows from every current event", async () => {
    renderWithRelay(
      connection([
        event([article("First")]),
        { internalID: "second", articles: [article("Second")] },
      ])
    )

    expect(await screen.findAllByTestId("event-article-row")).toHaveLength(2)
  })

  // Metaphysics drops attachments whose article is unpublished or deleted, so this arrives as
  // an event with an empty list rather than as no event at all.
  it("renders nothing, heading included, when no article resolved", () => {
    renderWithRelay(connection([event([])]))

    expect(screen.queryByTestId("city-guide-event-articles")).not.toBeOnTheScreen()
    expect(screen.queryByText("Artsy Editorial")).not.toBeOnTheScreen()
  })
})
