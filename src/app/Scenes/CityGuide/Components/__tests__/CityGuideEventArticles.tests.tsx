import { fireEvent, screen } from "@testing-library/react-native"
import { CityGuideEventArticlesRecommendedTestQuery } from "__generated__/CityGuideEventArticlesRecommendedTestQuery.graphql"
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
      query CityGuideEventArticlesTestQuery($citySlug: String!) @relay_test_operation {
        city(slug: $citySlug) {
          ...CityGuideEventArticles_city
        }
      }
    `,
    variables: { citySlug: "london-united-kingdom" },
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

  const cityArticles = (attachments: object[]) => ({
    City: () => ({ cityArticles: attachments }),
  })

  it("renders an unpressable section title when there are 4 or fewer articles", async () => {
    renderWithRelay(cityArticles([article("An Art Lover's Guide to London")]))

    expect(await screen.findByText("Artsy Editorial")).toBeOnTheScreen()
    expect(screen.queryByTestId("touchable-wrapper")).not.toBeOnTheScreen()
  })

  it("caps the section at 4 articles", async () => {
    renderWithRelay(
      cityArticles([0, 1, 2, 3, 4].map((position) => article(`Article ${position}`, position)))
    )

    expect(await screen.findAllByTestId("event-article-row")).toHaveLength(4)
  })

  it("gives the section title a chevron only when there are more than 4 articles", async () => {
    renderWithRelay(
      cityArticles([0, 1, 2, 3, 4].map((position) => article(`Article ${position}`, position)))
    )

    expect(await screen.findByTestId("touchable-wrapper")).toBeOnTheScreen()
  })

  it("navigates to the full article list when the chevron is tapped", async () => {
    renderWithRelay(
      cityArticles([0, 1, 2, 3, 4].map((position) => article(`Article ${position}`, position)))
    )

    fireEvent.press(await screen.findByTestId("touchable-wrapper"))

    expect(navigate).toHaveBeenCalledWith("/city-guide/london-united-kingdom/articles")
  })

  it("tracks the chevron tap", async () => {
    renderWithRelay(
      cityArticles([0, 1, 2, 3, 4].map((position) => article(`Article ${position}`, position)))
    )

    fireEvent.press(await screen.findByTestId("touchable-wrapper"))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action_name: "viewAll",
        action_type: "tap",
        owner_type: "CityGuide",
        owner_slug: "london-united-kingdom",
        context_module: "articles",
      })
    )
  })

  it("renders each article's thumbnail, title, byline and date", async () => {
    renderWithRelay(cityArticles([article("An Art Lover's Guide to London")]))

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
      cityArticles([
        article("10 Exhibitions to see in London this summer", 1),
        article("An Art Lover's Guide to London", 0),
      ])
    )

    const rows = await screen.findAllByTestId("event-article-row")

    expect(rows).toHaveLength(2)
    expect(rows[0]).toContainElement(screen.getByText("An Art Lover's Guide to London"))
  })

  it("navigates to the article when a row is tapped", async () => {
    renderWithRelay(cityArticles([article("An Art Lover's Guide to London")]))

    fireEvent.press((await screen.findAllByTestId("event-article-row"))[0])

    expect(navigate).toHaveBeenCalledWith("/article/An Art Lover's Guide to London")
  })

  it("tracks the tap on an article row", async () => {
    renderWithRelay(cityArticles([article("An Art Lover's Guide to London")]))

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
      cityArticles([article("An Art Lover's Guide to London", 0, { thumbnailImage: null })])
    )

    expect(await screen.findByTestId("event-article-no-image")).toBeOnTheScreen()
    expect(screen.queryByTestId("event-article-image")).not.toBeOnTheScreen()
  })

  it("renders a row per article attached to the city", async () => {
    renderWithRelay(cityArticles([article("First"), article("Second", 1)]))

    expect(await screen.findAllByTestId("event-article-row")).toHaveLength(2)
  })

  // Metaphysics drops attachments whose article is unpublished or deleted, so this arrives as
  // an empty list rather than as no field at all.
  it("renders nothing, heading included, when no article resolved", () => {
    renderWithRelay(cityArticles([]))

    expect(screen.queryByTestId("city-guide-event-articles")).not.toBeOnTheScreen()
    expect(screen.queryByText("Artsy Editorial")).not.toBeOnTheScreen()
  })

  it("does not render recommended articles when the flag is off, even if the server returns them", () => {
    renderWithRelay({
      City: () => ({
        cityArticles: [article("An Art Lover's Guide to London")],
        recommendedArticlesConnection: {
          edges: [{ node: article("A recommended read") }],
        },
      }),
    })

    expect(screen.queryByText("Recommended for you")).not.toBeOnTheScreen()
  })
})

describe("CityGuideEventArticles, recommended for you", () => {
  const { renderWithRelay } = setupTestWrapper<CityGuideEventArticlesRecommendedTestQuery>({
    Component: (props: any) => (
      <CityGuideEventArticles {...props} citySlug="london-united-kingdom" />
    ),
    query: graphql`
      query CityGuideEventArticlesRecommendedTestQuery(
        $citySlug: String!
        $enableArticlesForYou: Boolean!
      ) @relay_test_operation {
        city(slug: $citySlug) {
          ...CityGuideEventArticles_city @arguments(enableArticlesForYou: $enableArticlesForYou)
        }
      }
    `,
    variables: { citySlug: "london-united-kingdom", enableArticlesForYou: true },
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const article = (title: string, overrides: object = {}) => ({
    internalID: `id-for-${title}`,
    slug: `slug-for-${title}`,
    title: `${title} (headline)`,
    thumbnailTitle: title,
    byline: "Natalie Stoclet",
    href: `/article/${title}`,
    publishedAt: "July 19, 2026",
    thumbnailImage: { url: "https://example.com/article-thumb.jpg" },
    ...overrides,
  })

  const curated = (titles: string[]) =>
    titles.map((title, index) => ({
      internalID: `attachment-${index}`,
      position: index,
      article: article(title),
    }))

  // Metaphysics already merges, sorts and caps the connection to the section's 4 slots, so the
  // mock reflects that: `curatedTitles` says which of the connection's rows are curated, for
  // tagging tracking context, and `connectionTitles` is exactly the rows to render.
  const cityData = (
    curatedTitles: string[],
    connectionTitles: string[],
    { totalCount = connectionTitles.length, hasNextPage = false } = {}
  ) => ({
    City: () => ({
      cityArticles: curated(curatedTitles),
      recommendedArticlesConnection: {
        totalCount,
        pageInfo: { hasNextPage },
        edges: connectionTitles.map((title) => ({ node: article(title) })),
      },
    }),
  })

  it("renders the connection's rows, in the order Metaphysics returns them", async () => {
    renderWithRelay(
      cityData(["Curated 1", "Curated 2"], ["Curated 1", "Curated 2", "Recommended 1"])
    )

    const rows = await screen.findAllByTestId("event-article-row")
    expect(rows).toHaveLength(3)
    expect(rows[0]).toHaveTextContent(/Curated 1/)
    expect(rows[2]).toHaveTextContent(/Recommended 1/)
  })

  it("gives the section title a chevron when totalCount exceeds 4", async () => {
    renderWithRelay(
      cityData(["Curated 1"], ["Curated 1", "Rec 1", "Rec 2", "Rec 3"], { totalCount: 5 })
    )

    expect(await screen.findAllByTestId("event-article-row")).toHaveLength(4)
    expect(screen.getByTestId("touchable-wrapper")).toBeOnTheScreen()
  })

  it("gives the section title a chevron when the connection has a next page", async () => {
    renderWithRelay(cityData(["Curated 1"], ["Curated 1"], { hasNextPage: true }))

    expect(await screen.findByTestId("touchable-wrapper")).toBeOnTheScreen()
  })

  it("gives no chevron when totalCount is 4 or fewer and there's no next page", async () => {
    renderWithRelay(cityData(["Curated 1"], ["Curated 1", "Rec 1"]))

    expect(await screen.findAllByTestId("event-article-row")).toHaveLength(2)
    expect(screen.queryByTestId("touchable-wrapper")).not.toBeOnTheScreen()
  })

  it("shows the section with only recommendations when there are no curated articles", async () => {
    renderWithRelay(cityData([], ["A recommended read"]))

    expect(await screen.findByText("Artsy Editorial")).toBeOnTheScreen()
    expect(screen.getByText("A recommended read")).toBeOnTheScreen()
  })

  it("renders nothing when the connection is empty", () => {
    renderWithRelay(cityData([], []))

    expect(screen.queryByTestId("city-guide-event-articles")).not.toBeOnTheScreen()
  })

  it("tracks a tap on a curated row with the curated context_module", async () => {
    renderWithRelay(cityData(["Curated read"], ["Curated read"]))

    fireEvent.press((await screen.findAllByTestId("event-article-row"))[0])

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "tappedArticleGroup",
        context_module: "articles",
        destination_screen_owner_id: "id-for-Curated read",
      })
    )
  })

  it("tracks a tap on a recommended row with a distinct context_module", async () => {
    renderWithRelay(cityData([], ["A recommended read"]))

    fireEvent.press((await screen.findAllByTestId("event-article-row"))[0])

    expect(navigate).toHaveBeenCalledWith("/article/A recommended read")
    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "tappedArticleGroup",
        context_module: "relatedArticles",
        destination_screen_owner_id: "id-for-A recommended read",
      })
    )
  })
})
