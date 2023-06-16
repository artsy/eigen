import { screen } from "@testing-library/react-native"
import { ArticleBody } from "app/Scenes/Article/Components/ArticleBody"
import { ArticleHero } from "app/Scenes/Article/Components/ArticleHero"
import { ArticleSectionImageCollection } from "app/Scenes/Article/Components/Sections/ArticleSectionImageCollection/ArticleSectionImageCollection"
import { ArticleSectionText } from "app/Scenes/Article/Components/Sections/ArticleSectionText"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "relay-runtime"

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

  it("works", () => {
    renderWithRelay()

    expect(screen.UNSAFE_getByType(ArticleHero)).toBeOnTheScreen()
    expect(screen.UNSAFE_getByType(ArticleSectionImageCollection)).toBeOnTheScreen()
    expect(screen.UNSAFE_getByType(ArticleSectionText)).toBeOnTheScreen()
  })
})
