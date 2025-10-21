import { Image } from "@artsy/palette-mobile"
import { screen } from "@testing-library/react-native"
import { ArticleHero } from "app/Scenes/Article/Components/ArticleHero"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

// React-test-renderer has issues with memo components, so we need to mock the palette-mobile Image component
// Until it gets fixed
// See https://github.com/facebook/react/issues/17301
jest.mock("@artsy/palette-mobile", () => ({
  ...jest.requireActual("@artsy/palette-mobile"),
  Image: require("react-native").Image,
}))

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

  it("renders default fields", () => {
    renderWithRelay({
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

  it("renders hero image if available", () => {
    renderWithRelay({
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

    expect(screen.UNSAFE_getByType(Image)).toBeTruthy()
  })

  it("renders hero video if available", () => {
    renderWithRelay({
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

    expect(screen.UNSAFE_queryByType(Image)).toBeNull()
    expect(screen.getByTestId("ArticleHeroVideo")).toBeTruthy()
  })

  it("does not render hero image if not available", () => {
    renderWithRelay({
      Article: () => ({
        hero: null,
        publishedAt: "2023-06-15T00:00:00.000Z",
      }),
    })

    expect(screen.UNSAFE_queryByType(Image)).toBeNull()
  })
})
