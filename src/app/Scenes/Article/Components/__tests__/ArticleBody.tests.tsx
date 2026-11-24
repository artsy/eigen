import { screen } from "@testing-library/react-native"
import { ArticleBody } from "app/Scenes/Article/Components/ArticleBody"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("app/Scenes/Article/Components/ArticleHero", () => {
  const { Text } = require("react-native")
  return { ArticleHero: () => <Text testID="ArticleHero">ArticleHero</Text> }
})

// ArticleSectionImageCollection is only rendered through ArticleSection, so its presence
// also verifies that ArticleSection rendered
jest.mock(
  "app/Scenes/Article/Components/Sections/ArticleSectionImageCollection/ArticleSectionImageCollection",
  () => {
    const { Text } = require("react-native")
    return {
      ArticleSectionImageCollection: () => (
        <Text testID="ArticleSectionImageCollection">ArticleSectionImageCollection</Text>
      ),
    }
  }
)

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

  it("renders", async () => {
    await renderWithRelay({
      Article: () => ({
        hero: {
          media: null,
        },
      }),
    })

    expect(screen.getByTestId("ArticleHero")).toBeOnTheScreen()
    expect(screen.getByTestId("ArticleSectionImageCollection")).toBeOnTheScreen()
  })
})
