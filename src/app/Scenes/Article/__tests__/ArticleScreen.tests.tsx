import { screen } from "@testing-library/react-native"
import { ArticleScreen } from "app/Scenes/Article/ArticleScreen"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("ArticleScreen", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: ArticleScreen,
    variables: {
      slug: "some-id",
    },
  })

  it("renders standard article", async () => {
    renderWithRelay({
      Query: () => ({
        article: {
          title: "Article Title",
          layout: "STANDARD",
        },
      }),
    })

    await screen.findByText("Article Title")

    expect(screen.getByTestId("ArticleRelatedArticlesRail")).toBeOnTheScreen()
  })

  it("renders featured article", async () => {
    renderWithRelay({
      Query: () => ({
        article: {
          title: "Article Title",
          layout: "FEATURE",
        },
      }),
    })

    await screen.findByText("Article Title")
    expect(screen.getByTestId("ArticleRelatedArticlesRail")).toBeOnTheScreen()
  })

  it("redirects to webview if not standard or feature", async () => {
    renderWithRelay({
      Query: () => ({
        article: {
          internalID: "foo",
          title: "Article Title",
          layout: "VIDEO",
        },
      }),
    })

    await screen.findByTestId("ArticleWebViewScreen")

    expect(screen.getByTestId("ArticleWebViewScreen")).toBeOnTheScreen()
  })
})
