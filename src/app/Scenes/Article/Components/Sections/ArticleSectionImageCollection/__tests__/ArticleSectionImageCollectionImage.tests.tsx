import { screen, waitFor } from "@testing-library/react-native"
import { ArticleSectionImageCollectionImageTestQuery } from "__generated__/ArticleSectionImageCollectionImageTestQuery.graphql"
import { ArticleSectionImageCollectionImage } from "app/Scenes/Article/Components/Sections/ArticleSectionImageCollection/ArticleSectionImageCollectionImage"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Suspense } from "react"
import { Image } from "react-native"
import { useLazyLoadQuery, graphql } from "react-relay"

// React-test-renderer has issues with memo components, so we need to mock the palette-mobile Image component
// Until it gets fixed
// See https://github.com/facebook/react/issues/17301
jest.mock("@artsy/palette-mobile", () => ({
  ...jest.requireActual("@artsy/palette-mobile"),
  Image: require("react-native").Image,
}))

describe("ArticleSectionImageCollectionImage", () => {
  const Article = () => {
    const data = useLazyLoadQuery<ArticleSectionImageCollectionImageTestQuery>(
      graphql`
        query ArticleSectionImageCollectionImageTestQuery {
          article(id: "foo") {
            sections {
              ... on ArticleSectionImageCollection {
                figures {
                  ...ArticleSectionImageCollectionImage_figure
                }
              }
            }
          }
        }
      `,
      {}
    )

    return <ArticleSectionImageCollectionImage figure={data.article!.sections[0].figures?.[0]!} />
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
      expect(screen.UNSAFE_queryByType(Image)).toBeTruthy()
    })
  })

  it("renders Artwork type", async () => {
    renderWithRelay({
      ArticleSectionImageCollection: () => ({
        figures: [{ __typename: "Artwork" }],
      }),
    })

    await waitFor(() => {
      expect(screen.UNSAFE_queryByType(Image)).toBeTruthy()
    })
  })
})
