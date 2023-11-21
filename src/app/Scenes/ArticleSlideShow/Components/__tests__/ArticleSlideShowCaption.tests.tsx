import { screen } from "@testing-library/react-native"
import { getFigures } from "app/Scenes/ArticleSlideShow/Components/ArticleSlideShow"
import { ArticleSlideShowCaption } from "app/Scenes/ArticleSlideShow/Components/ArticleSlideShowCaption"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArticleSlideShowCaption", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: (props: any) => {
      const figures = !!props?.article?.sections ? getFigures(props.article) : []

      return <ArticleSlideShowCaption figure={figures[0] ?? null} />
    },
    query: graphql`
      query ArticleSlideShowCaptionTestQuery @relay_test_operation {
        article(id: "article-id") {
          sections {
            __typename
            ... on ArticleSectionImageCollection {
              figures {
                ...ArticleSlideShowCaption_figure
              }
            }
            ... on ArticleSectionImageSet {
              figures {
                ...ArticleSlideShowCaption_figure
              }
            }
          }
        }
      }
    `,
  })

  it("renders Artwork", () => {
    renderWithRelay({
      Article: () => article,
      ArticleSectionImageCollectionFigure: () => ({
        __typename: "Artwork",
      }),
      Artwork: () => ({
        title: "Test Artwork",
      }),
    })

    expect(screen.getByText("Test Artwork")).toBeOnTheScreen()
  })

  it("renders ArticleImageSection", () => {
    renderWithRelay({
      Article: () => article,
      ArticleSectionImageCollectionFigure: () => ({
        __typename: "ArticleImageSection",
        caption: "Test caption",
      }),
    })

    expect(screen.getByText("Test caption")).toBeOnTheScreen()
  })

  it("renders ArticleUnpublishedArtwork", () => {
    renderWithRelay({
      Article: () => article,
      ArticleSectionImageCollectionFigure: () => ({
        __typename: "ArticleUnpublishedArtwork",
        title: "Unpublished Artwork",
        date: "Oct 2023",
      }),
    })

    expect(screen.getByText("Unpublished Artwork, Oct 2023")).toBeOnTheScreen()
  })
})

const article = {
  sections: [
    { __typename: "ArticleSectionImageSet", figures: [{}] },
    { __typename: "ArticleSectionImageCollection", figures: [{}] },
  ],
}
