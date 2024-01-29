import { screen } from "@testing-library/react-native"
import { ArticleBody } from "app/Scenes/Article/Components/ArticleBody"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArticleBody", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: ArticleBody,
    query: graphql`
      query ArticleBodyTestQuery {
        article(id: "foo") {
          ...ArticleBody_article
        }
      }
    `,
  })

  it("renders", () => {
    renderWithRelay()

    expect(screen.getByTestId("ArticleHeroSection")).toBeOnTheScreen()
    expect(screen.getByTestId("ArticleSectionImageCollection")).toBeOnTheScreen()
  })
})
