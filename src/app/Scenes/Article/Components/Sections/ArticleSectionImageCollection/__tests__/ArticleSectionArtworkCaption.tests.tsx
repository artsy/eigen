import { fireEvent, screen } from "@testing-library/react-native"
import { ArticleSectionArtworkCaptionTestQuery } from "__generated__/ArticleSectionArtworkCaptionTestQuery.graphql"
import { ArticleSectionArtworkCaption } from "app/Scenes/Article/Components/Sections/ArticleSectionImageCollection/ArticleSectionArtworkCaption"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArticleSectionArtworkCaption", () => {
  const { renderWithRelay } = setupTestWrapper<ArticleSectionArtworkCaptionTestQuery>({
    Component: ({ artwork }) => {
      return <ArticleSectionArtworkCaption artwork={artwork!} />
    },
    query: graphql`
      query ArticleSectionArtworkCaptionTestQuery @relay_test_operation {
        artwork(id: "test-id") {
          ...ArticleSectionArtworkCaption_artwork
        }
      }
    `,
  })

  it("renders", async () => {
    renderWithRelay({ Artwork: () => artwork })

    expect(screen.getByText("Test Artwork, 2023")).toBeOnTheScreen()
    expect(screen.getByText("Test Partner")).toBeOnTheScreen()
    expect(screen.getByText("Test Artist")).toBeOnTheScreen()
    expect(screen.getByText("Price on request")).toBeOnTheScreen()
  })

  it("navigates", async () => {
    renderWithRelay({ Artwork: () => artwork })

    fireEvent.press(screen.getByText("Test Artwork, 2023"))
    expect(navigate).toHaveBeenCalledWith("artwork-href")

    fireEvent.press(screen.getByText("Test Partner"))
    expect(navigate).toHaveBeenCalledWith("partner-href")

    fireEvent.press(screen.getByText("Test Artist"))
    expect(navigate).toHaveBeenCalledWith("artist-href")
  })
})

const artwork = {
  title: "Test Artwork",
  href: "artwork-href",
  partner: {
    name: "Test Partner",
    href: "partner-href",
  },
  date: "2023",
  artists: [{ name: "Test Artist", href: "artist-href" }],
  saleMessage: "Price on request",
}
