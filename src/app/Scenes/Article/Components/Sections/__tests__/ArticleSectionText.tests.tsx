import { screen, waitFor } from "@testing-library/react-native"
import { ArticleSectionTextTestQuery } from "__generated__/ArticleSectionTextTestQuery.graphql"
import { ArticleSectionText } from "app/Scenes/Article/Components/Sections/ArticleSectionText"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Suspense } from "react"
import { useLazyLoadQuery } from "react-relay"
import { graphql } from "relay-runtime"

describe("ArticleSectionText", () => {
  const Article = () => {
    const data = useLazyLoadQuery<ArticleSectionTextTestQuery>(
      graphql`
        query ArticleSectionTextTestQuery @relay_test_operation {
          article(id: "foo") {
            sections {
              ...ArticleSectionText_section
            }
          }
        }
      `,
      {}
    )

    return <ArticleSectionText section={data.article!.sections[0]} internalID="foo" slug="bar" />
  }

  const { renderWithRelay } = setupTestWrapper({
    Component: () => (
      <Suspense fallback={null}>
        <Article />
      </Suspense>
    ),
  })

  it("renders", async () => {
    renderWithRelay({
      Article: () => ({
        sections: [
          {
            body: "<p>Example Article</p>",
          },
        ],
      }),
    })

    await waitFor(() => {
      expect(screen.getByText("Example Article")).toBeOnTheScreen()
    })
  })
})
