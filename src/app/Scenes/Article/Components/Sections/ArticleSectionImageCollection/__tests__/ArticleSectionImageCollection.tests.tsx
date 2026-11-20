import { screen } from "@testing-library/react-native"
import { ArticleSectionImageCollectionTestQuery } from "__generated__/ArticleSectionImageCollectionTestQuery.graphql"
import { ArticleSectionImageCollection } from "app/Scenes/Article/Components/Sections/ArticleSectionImageCollection/ArticleSectionImageCollection"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock(
  "app/Scenes/Article/Components/Sections/ArticleSectionImageCollection/ArticleSectionImageCollectionImage",
  () => {
    const { Text } = require("react-native")
    return {
      ArticleSectionImageCollectionImage: () => (
        <Text testID="ArticleSectionImageCollectionImage">Image</Text>
      ),
    }
  }
)

jest.mock(
  "app/Scenes/Article/Components/Sections/ArticleSectionImageCollection/ArticleSectionImageCollectionCaption",
  () => {
    const { Text } = require("react-native")
    return {
      ArticleSectionImageCollectionCaption: () => (
        <Text testID="ArticleSectionImageCollectionCaption">Caption</Text>
      ),
    }
  }
)

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
    await renderWithRelay()

    expect(screen.getByTestId("ArticleSectionImageCollectionImage")).toBeOnTheScreen()
    expect(screen.getByTestId("ArticleSectionImageCollectionCaption")).toBeOnTheScreen()
  })
})
