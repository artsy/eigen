import { screen } from "@testing-library/react-native"
import { ArticleHero } from "app/Scenes/Article/Components/ArticleHero"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("@artsy/palette-mobile", () => {
  const { Image } = require("react-native")
  return {
    ...jest.requireActual("@artsy/palette-mobile"),
    Image: (props: any) => <Image {...props} testID="palette-image" />,
  }
})

describe("ArticleHero", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: ArticleHero,
    query: graphql`
      query ArticleHeroTestQuery {
        article(id: "foo") {
          ...ArticleHero_article
        }
      }
    `,
  })

  it("renders default fields", async () => {
    await renderWithRelay({
      Article: () => ({
        hero: {
          media: null,
          image: {
            url: "https://example.com/image.jpg",
            aspectRatio: 1.5,
          },
        },
        vertical: "Vertical",
        title: "Title",
        byline: "Byline",
        publishedAt: "2023-06-12T00:00:00.000",
      }),
    })

    expect(screen.getByText("Vertical")).toBeOnTheScreen()
    expect(screen.getByText("Title")).toBeOnTheScreen()
    expect(screen.getByText("Byline")).toBeOnTheScreen()
    expect(screen.getByText("Jun 12, 2023")).toBeOnTheScreen()
  })

  it("renders hero image if available", async () => {
    await renderWithRelay({
      Article: () => ({
        hero: {
          media: null,
          image: {
            url: "https://example.com/image.jpg",
            aspectRatio: 1.5,
          },
        },
        publishedAt: "2023-06-15T00:00:00.000Z",
      }),
    })

    expect(screen.getByTestId("palette-image")).toBeOnTheScreen()
  })

  it("renders hero video if available", async () => {
    await renderWithRelay({
      Article: () => ({
        hero: {
          media: "https://example.com/video.mp4",
          image: {
            url: "https://example.com/image.jpg",
            aspectRatio: 1.5,
          },
        },
        vertical: "Vertical",
        title: "Title",
        byline: "Byline",
        publishedAt: "2023-06-15T00:00:00.000Z",
      }),
    })

    expect(screen.queryByTestId("palette-image")).not.toBeOnTheScreen()
    expect(screen.getByTestId("ArticleHeroVideo")).toBeOnTheScreen()
  })

  it("does not render hero image if not available", async () => {
    await renderWithRelay({
      Article: () => ({
        hero: null,
        publishedAt: "2023-06-15T00:00:00.000Z",
      }),
    })

    expect(screen.queryByTestId("palette-image")).not.toBeOnTheScreen()
  })
})
