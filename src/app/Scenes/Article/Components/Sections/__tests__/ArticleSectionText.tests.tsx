import { screen } from "@testing-library/react-native"
import { ArticleSectionTextTestQuery } from "__generated__/ArticleSectionTextTestQuery.graphql"
import { ArticleSectionText } from "app/Scenes/Article/Components/Sections/ArticleSectionText"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArticleSectionText", () => {
  const { renderWithRelay } = setupTestWrapper<ArticleSectionTextTestQuery>({
    Component: ({ article }) => {
      return <ArticleSectionText article={article!} section={article!.sections[0]} />
    },
    query: graphql`
      query ArticleSectionTextTestQuery @relay_test_operation {
        article(id: "article-id") {
          ...ArticleSectionText_article
          sections {
            ...ArticleSectionText_section
          }
        }
      }
    `,
  })

  it("renders", () => {
    renderWithRelay({
      Article: () => ({
        sections: [
          {
            body: "<p>Example Article</p>",
          },
        ],
      }),
    })

    expect(screen.getByText("Example Article")).toBeOnTheScreen()
  })
})
