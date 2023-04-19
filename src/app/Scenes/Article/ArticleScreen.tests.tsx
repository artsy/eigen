import { ArticleScreen } from "app/Scenes/Article/ArticleScreen"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("SimilarToRecentlyViewed", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: ArticleScreen,
    variables: {
      slug: "some-id",
    },
  })

  it("renders SimilarToRecentlyViewed", () => {
    const tree = renderWithRelay({
      Query: () => ({
        internalID: "foo",
      }),
    })
    expect(tree.findByText("Hi Article")).toBeTruthy()
  })
})
