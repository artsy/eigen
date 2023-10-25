import { fireEvent, screen } from "@testing-library/react-native"
import { getFigures } from "app/Scenes/ArticleSlideShow/Components/ArticleSlideShow"
import { ArticleSlideShowImage } from "app/Scenes/ArticleSlideShow/Components/ArticleSlideShowImage"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArticleSlideShowImage", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: (props: any) => {
      const figures = !!props?.article?.sections ? getFigures(props.article) : []

      return <ArticleSlideShowImage figure={figures[0] ?? null} />
    },
    query: graphql`
      query ArticleSlideShowImageTestQuery @relay_test_operation {
        article(id: "article-id") {
          sections {
            __typename
            ... on ArticleSectionImageCollection {
              figures {
                ...ArticleSlideShowImage_figure
              }
            }
            ... on ArticleSectionImageSet {
              figures {
                ...ArticleSlideShowImage_figure
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
      Artwork: () => ({ image }),
    })

    fireEvent(screen.getByTestId("image-container"), "layout", layoutEvent)

    expect(screen.getByTestId("slide-image")).toBeOnTheScreen()
  })

  it("renders ArticleImageSection", () => {
    renderWithRelay({
      Article: () => article,
      ArticleSectionImageCollectionFigure: () => ({
        __typename: "ArticleImageSection",
      }),
      ArticleImageSection: () => ({ image }),
    })

    fireEvent(screen.getByTestId("image-container"), "layout", layoutEvent)

    expect(screen.getByTestId("slide-image")).toBeOnTheScreen()
  })

  it("renders ArticleUnpublishedArtwork", () => {
    renderWithRelay({
      Article: () => article,
      ArticleSectionImageCollectionFigure: () => ({
        __typename: "ArticleUnpublishedArtwork",
      }),
      ArticleUnpublishedArtwork: () => ({ image }),
    })

    fireEvent(screen.getByTestId("image-container"), "layout", layoutEvent)

    expect(screen.getByTestId("slide-image")).toBeOnTheScreen()
  })
})

const article = {
  sections: [
    { __typename: "ArticleSectionImageSet", figures: [{}] },
    { __typename: "ArticleSectionImageCollection", figures: [{}] },
  ],
}

const image = {
  width: 200,
  height: 200,
  aspectRatio: 1,
}

const layoutEvent = {
  nativeEvent: { layout: { width: 10, height: 10 } },
}
