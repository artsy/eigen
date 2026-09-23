import { screen } from "@testing-library/react-native"
import { CityArticlesScreen } from "app/Scenes/CityGuide/Screens/CityArticles"
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

  it("renders a row for every article the query returns, not just the section's cap of 4", async () => {
    const attachments = [0, 1, 2, 3, 4, 5].map((position) =>
      article(`Article ${position}`, position)
    )

    renderWithRelay({ City: () => ({ cityArticles: attachments }) })

    expect(await screen.findAllByTestId("event-article-row")).toHaveLength(attachments.length)
  })

  it("orders rows by the attachment's position", async () => {
    renderWithRelay({
      City: () => ({
        cityArticles: [article("Second", 1), article("First", 0)],
      }),
    })

    const rows = await screen.findAllByTestId("event-article-row")

    expect(rows[0]).toContainElement(screen.getByText("First"))
  })
})
