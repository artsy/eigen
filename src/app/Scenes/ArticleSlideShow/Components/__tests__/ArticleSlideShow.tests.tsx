import { screen } from "@testing-library/react-native"
import { ArticleSlideShowTestQuery } from "__generated__/ArticleSlideShowTestQuery.graphql"
import { ArticleSlideShow } from "app/Scenes/ArticleSlideShow/Components/ArticleSlideShow"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArticleSlideShow", () => {
  let coverId = "image-1"

  const { renderWithRelay } = setupTestWrapper<ArticleSlideShowTestQuery>({
    Component: ({ article }) => <ArticleSlideShow article={article!} coverId={coverId} />,
    query: graphql`
      query ArticleSlideShowTestQuery @relay_test_operation {
        article(id: "article-id") {
          ...ArticleSlideShow_article
        }
      }
    `,
  })

  afterEach(() => {
    coverId = "image-1"
  })

  it("renders", () => {
    renderWithRelay({ Article: () => article })

    expect(screen.getByLabelText("Image and description rail")).toBeOnTheScreen()
    expect(screen.queryByText("Test Title")).not.toBeOnTheScreen()
  })

  it("shows the title for a given slide with a title", () => {
    coverId = "image-2"
    renderWithRelay({ Article: () => article })

    expect(screen.queryByText("Test Title")).toBeOnTheScreen()
  })
})

const article = {
  sections: [
    { __typename: "ArticleSectionImageSet", figures: [{ __typename: "Artwork", id: "image-1" }] },
    {
      __typename: "ArticleSectionImageSet",
      title: "Test Title",
      figures: [{ __typename: "Artwork", id: "image-2" }],
    },
  ],
}
