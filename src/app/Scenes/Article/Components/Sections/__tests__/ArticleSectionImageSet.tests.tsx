import { fireEvent, screen } from "@testing-library/react-native"
import { ArticleSectionImageSetTestQuery } from "__generated__/ArticleSectionImageSetTestQuery.graphql"
import { ArticleSectionImageSet } from "app/Scenes/Article/Components/Sections/ArticleSectionImageSet"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArticleSectionImageSet", () => {
  const { renderWithRelay } = setupTestWrapper<ArticleSectionImageSetTestQuery>({
    Component: ({ article }) => {
      return <ArticleSectionImageSet article={article} section={article!.sections[0]} />
    },
    query: graphql`
      query ArticleSectionImageSetTestQuery @relay_test_operation {
        article(id: "article-id") {
          ...ArticleSectionImageSet_article
          sections {
            ...ArticleSectionImageSet_section
          }
        }
      }
    `,
  })

  it("renders MINI layout", () => {
    renderWithRelay({
      Article: () => ({
        internalID: "article-id",
        sections: [
          {
            layout: "MINI",
            cover: { id: "cover-id" },
          },
        ],
      }),
    })

    expect(screen.getByText("View Slideshow")).toBeOnTheScreen()
    expect(screen.getByTestId("small-image-slideshow")).toBeOnTheScreen()

    fireEvent.press(screen.getByText("View Slideshow"))

    expect(navigate).toHaveBeenCalledWith("article/article-id/slideshow", {
      passProps: { coverId: "cover-id" },
    })
  })

  it("renders FULL layout", () => {
    renderWithRelay({
      Article: () => ({
        internalID: "article-id",
        sections: [
          {
            layout: "FULL",
            cover: { id: "cover-id" },
          },
        ],
      }),
    })

    expect(screen.getByText("View Slideshow")).toBeOnTheScreen()
    expect(screen.queryByTestId("small-image-slideshow")).not.toBeOnTheScreen()
    expect(screen.getByTestId("image-slideshow")).toBeOnTheScreen()

    fireEvent.press(screen.getByText("View Slideshow"))

    expect(navigate).toHaveBeenCalledWith("article/article-id/slideshow", {
      passProps: { coverId: "cover-id" },
    })
  })
})
