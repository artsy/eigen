import { screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { ArticleScreen } from "app/Scenes/Article/ArticleScreen"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("SimilarToRecentlyViewed", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: ArticleScreen,
    variables: {
      slug: "some-id",
    },
  })

  it("renders SimilarToRecentlyViewed", async () => {
    renderWithRelay({
      Query: () => ({
        article: {
          internalID: "foo",
          title: "Hi Article",
        },
      }),
    })

    // need to await for the PlaceholderGrid to be removed
    await waitForElementToBeRemoved(() => screen.getByTestId("PlaceholderGrid"))

    expect(screen.queryByText("Hi Article")).toBeOnTheScreen()
  })
})
