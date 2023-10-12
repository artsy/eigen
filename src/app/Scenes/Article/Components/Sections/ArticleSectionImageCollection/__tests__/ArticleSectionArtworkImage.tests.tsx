import { fireEvent, screen } from "@testing-library/react-native"
import { ArticleSectionArtworkImageTestQuery } from "__generated__/ArticleSectionArtworkImageTestQuery.graphql"
import { ArticleSectionArtworkImage } from "app/Scenes/Article/Components/Sections/ArticleSectionImageCollection/ArticleSectionArtworkImage"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArticleSectionArtworkImage", () => {
  const { renderWithRelay } = setupTestWrapper<ArticleSectionArtworkImageTestQuery>({
    Component: ({ artwork }) => {
      return <ArticleSectionArtworkImage artwork={artwork!} />
    },
    query: graphql`
      query ArticleSectionArtworkImageTestQuery @relay_test_operation {
        artwork(id: "test-id") {
          ...ArticleSectionArtworkImage_artwork
        }
      }
    `,
  })

  it("renders", async () => {
    renderWithRelay()

    expect(screen.getByLabelText(`Image of <mock-value-for-field-\"title\">`)).toBeOnTheScreen()
  })

  it("navigates to the artwork", async () => {
    renderWithRelay()

    fireEvent.press(screen.getByLabelText(`Image of <mock-value-for-field-\"title\">`))

    expect(navigate).toHaveBeenCalledWith(`<mock-value-for-field-\"href\">`)
  })
})
