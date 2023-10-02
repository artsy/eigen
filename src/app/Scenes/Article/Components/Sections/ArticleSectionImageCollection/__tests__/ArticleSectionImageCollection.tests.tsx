import { screen, waitFor } from "@testing-library/react-native"
import { ArticleSectionImageCollectionTestQuery } from "__generated__/ArticleSectionImageCollectionTestQuery.graphql"
import { ArticleSectionImageCollection } from "app/Scenes/Article/Components/Sections/ArticleSectionImageCollection/ArticleSectionImageCollection"
import { ArticleSectionImageCollectionCaption } from "app/Scenes/Article/Components/Sections/ArticleSectionImageCollection/ArticleSectionImageCollectionCaption"
import { ArticleSectionImageCollectionImage } from "app/Scenes/Article/Components/Sections/ArticleSectionImageCollection/ArticleSectionImageCollectionImage"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Suspense } from "react"
import { useLazyLoadQuery } from "react-relay"
import { graphql } from "relay-runtime"

describe("ArticleSectionImageCollection", () => {
  const Article = () => {
    const data = useLazyLoadQuery<ArticleSectionImageCollectionTestQuery>(
      graphql`
        query ArticleSectionImageCollectionTestQuery @relay_test_operation {
          article(id: "foo") {
            sections {
              ...ArticleSectionImageCollection_section
            }
          }
        }
      `,
      {}
    )

    return <ArticleSectionImageCollection section={data.article!.sections[0]} />
  }

  const { renderWithRelay } = setupTestWrapper({
    Component: () => (
      <Suspense fallback={null}>
        <Article />
      </Suspense>
    ),
  })

  it("renders", async () => {
    renderWithRelay()

    await waitFor(() => {
      expect(screen.UNSAFE_getByType(ArticleSectionImageCollectionImage)).toBeOnTheScreen()
      expect(screen.UNSAFE_getByType(ArticleSectionImageCollectionCaption)).toBeOnTheScreen()
    })
  })
})
