import { screen, waitFor } from "@testing-library/react-native"
import { ArticleSectionImageCollectionTestQuery } from "__generated__/ArticleSectionImageCollectionTestQuery.graphql"
import { ArticleSectionImageCollection } from "app/Scenes/Article/Components/Sections/ArticleSectionImageCollection/ArticleSectionImageCollection"
import { ArticleSectionImageCollectionCaption } from "app/Scenes/Article/Components/Sections/ArticleSectionImageCollection/ArticleSectionImageCollectionCaption"
import { ArticleSectionImageCollectionImage } from "app/Scenes/Article/Components/Sections/ArticleSectionImageCollection/ArticleSectionImageCollectionImage"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArticleSectionImageCollection", () => {
  const { renderWithRelay } = setupTestWrapper<ArticleSectionImageCollectionTestQuery>({
    Component: (props) => <ArticleSectionImageCollection section={props.article?.sections[0]!} />,
    query: graphql`
      query ArticleSectionImageCollectionTestQuery @relay_test_operation {
        article(id: "foo") {
          sections {
            ...ArticleSectionImageCollection_section
          }
        }
      }
    `,
  })

  it("renders", async () => {
    renderWithRelay()

    await waitFor(() => {
      expect(screen.UNSAFE_getByType(ArticleSectionImageCollectionImage)).toBeOnTheScreen()
      expect(screen.UNSAFE_getByType(ArticleSectionImageCollectionCaption)).toBeOnTheScreen()
    })
  })
})
