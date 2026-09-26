import { fireEvent, screen } from "@testing-library/react-native"
import { CityArticlesScreen } from "app/Scenes/CityGuide/Screens/CityArticles"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

// React-test-renderer has issues with memo components, so we need to mock the palette-mobile
// Image component. See https://github.com/facebook/react/issues/17301
jest.mock("@artsy/palette-mobile", () => ({
  ...jest.requireActual("@artsy/palette-mobile"),
  Image: require("react-native").Image,
}))

describe("CityArticlesScreen", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => <CityArticlesScreen citySlug="london-united-kingdom" />,
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const article = (title: string, position: number) => ({
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
    },
  })

  it("titles the screen", async () => {
    renderWithRelay({ City: () => ({ cityArticles: [article("Only Article", 0)] }) })

    expect(await screen.findByText("Artsy Editorial")).toBeOnTheScreen()
  })

  it("renders a row for every curated article when the flag is off", async () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCityGuideArticlesForYou: false })

    const attachments = [0, 1, 2, 3, 4, 5].map((position) =>
      article(`Article ${position}`, position)
    )

    renderWithRelay({ City: () => ({ cityArticles: attachments }) })

    expect(await screen.findAllByTestId("event-article-row")).toHaveLength(attachments.length)
  })

  it("orders rows by the attachment's position", async () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCityGuideArticlesForYou: false })

    renderWithRelay({
      City: () => ({
        cityArticles: [article("Second", 1), article("First", 0)],
      }),
    })

    const rows = await screen.findAllByTestId("event-article-row")

    expect(rows[0]).toContainElement(screen.getByText("First"))
  })

  describe("when the flag is on", () => {
    const recommended = (title: string) => ({ ...article(title, 0).article })

    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCityGuideArticlesForYou: true })
    })

    it("renders every row from the connection, not the curated array", async () => {
      renderWithRelay({
        City: () => ({
          cityArticles: [article("Curated", 0)],
          recommendedArticlesConnection: {
            totalCount: 4,
            pageInfo: { hasNextPage: false },
            edges: ["Curated", "Rec 1", "Rec 2", "Rec 3"].map((title) => ({
              node: recommended(title),
            })),
          },
        }),
      })

      const rows = await screen.findAllByTestId("event-article-row")
      expect(rows).toHaveLength(4)
      expect(rows[0]).toContainElement(screen.getByText("Curated"))
      expect(rows[3]).toContainElement(screen.getByText("Rec 3"))
    })

    it("tags a curated row's tracking with the curated context_module", async () => {
      renderWithRelay({
        City: () => ({
          cityArticles: [article("Curated", 0)],
          recommendedArticlesConnection: {
            totalCount: 1,
            pageInfo: { hasNextPage: false },
            edges: [{ node: recommended("Curated") }],
          },
        }),
      })

      fireEvent.press((await screen.findAllByTestId("event-article-row"))[0])

      expect(mockTrackEvent).toHaveBeenCalledWith(
        expect.objectContaining({ context_module: "articles" })
      )
    })

    it("tags a recommended row's tracking with a distinct context_module", async () => {
      renderWithRelay({
        City: () => ({
          cityArticles: [],
          recommendedArticlesConnection: {
            totalCount: 1,
            pageInfo: { hasNextPage: false },
            edges: [{ node: recommended("Rec 1") }],
          },
        }),
      })

      fireEvent.press((await screen.findAllByTestId("event-article-row"))[0])

      expect(mockTrackEvent).toHaveBeenCalledWith(
        expect.objectContaining({ context_module: "relatedArticles" })
      )
    })

    it("loads the next page when the list end is reached", async () => {
      const { mockResolveLastOperation } = renderWithRelay({
        City: () => ({
          cityArticles: [],
          recommendedArticlesConnection: {
            totalCount: 2,
            pageInfo: { hasNextPage: true },
            edges: [{ node: recommended("Rec 1") }],
          },
        }),
      })

      expect(await screen.findAllByTestId("event-article-row")).toHaveLength(1)

      fireEvent(screen.getByTestId("city-articles-list"), "onEndReached")

      mockResolveLastOperation({
        City: () => ({
          recommendedArticlesConnection: {
            totalCount: 2,
            pageInfo: { hasNextPage: false },
            edges: [{ node: recommended("Rec 2") }],
          },
        }),
      })

      const rows = await screen.findAllByTestId("event-article-row")
      expect(rows).toHaveLength(2)
      expect(rows[1]).toContainElement(screen.getByText("Rec 2"))
    })
  })

  it("lists only the curated articles when the flag is off, even if the server returns recommendations", async () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCityGuideArticlesForYou: false })

    renderWithRelay({
      City: () => ({
        cityArticles: [article("Curated", 0)],
        recommendedArticlesConnection: {
          edges: [{ node: { ...article("Rec 1", 0).article } }],
        },
      }),
    })

    expect(await screen.findAllByTestId("event-article-row")).toHaveLength(1)
    expect(screen.queryByText("Rec 1")).not.toBeOnTheScreen()
  })
})
