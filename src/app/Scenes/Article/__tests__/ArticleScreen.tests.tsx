import { screen, waitFor } from "@testing-library/react-native"
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
    await renderWithRelay({
      Article: () => ({
        title: "Article Title",
        layout: "STANDARD",
        hero: {
          media: null,
        },
      }),
    })

    // Resolving during render means the placeholder is already gone by now
    await waitFor(
      () => expect(screen.queryByTestId("ArticleScreenPlaceholder")).not.toBeOnTheScreen(),
      { timeout: 15000 }
    )

    expect(screen.getByText("Article Title")).toBeOnTheScreen()

    expect(screen.getByTestId("ArticleRelatedArticlesRail")).toBeOnTheScreen()
  })

  it("renders featured article", async () => {
    await renderWithRelay({
      Article: () => ({
        title: "Article Title",
        layout: "FEATURE",
        hero: {
          media: null,
        },
      }),
    })

    // Resolving during render means the placeholder is already gone by now
    await waitFor(
      () => expect(screen.queryByTestId("ArticleScreenPlaceholder")).not.toBeOnTheScreen(),
      { timeout: 15000 }
    )

    await screen.findByText("Article Title")
    expect(screen.getByTestId("ArticleRelatedArticlesRail")).toBeOnTheScreen()
  })

  it("redirects to webview if not standard or feature", async () => {
    await renderWithRelay({
      Article: () => ({
        internalID: "foo",
        title: "Article Title",
        layout: "VIDEO",
      }),
    })

    // Resolving during render means the placeholder is already gone by now
    await waitFor(
      () => expect(screen.queryByTestId("ArticleScreenPlaceholder")).not.toBeOnTheScreen(),
      { timeout: 15000 }
    )

    expect(screen.getByTestId("ArticleWebViewScreen")).toBeOnTheScreen()
  })
})
