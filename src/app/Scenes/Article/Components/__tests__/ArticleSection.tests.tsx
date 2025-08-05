import { screen } from "@testing-library/react-native"
import { ArticleSectionTestQuery } from "__generated__/ArticleSectionTestQuery.graphql"
import { ArticleSection } from "app/Scenes/Article/Components/ArticleSection"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

// Mock the child section components
jest.mock("app/Scenes/Article/Components/Sections/ArticleSectionText", () => {
  const { Text } = require("react-native")
  return {
    ArticleSectionText: () => <Text>ArticleSectionText</Text>,
  }
})

jest.mock(
  "app/Scenes/Article/Components/Sections/ArticleSectionImageCollection/ArticleSectionImageCollection",
  () => {
    const { Text } = require("react-native")
    return {
      ArticleSectionImageCollection: () => <Text>ArticleSectionImageCollection</Text>,
    }
  }
)

jest.mock("app/Scenes/Article/Components/Sections/ArticleSectionImageSet", () => {
  const { Text } = require("react-native")
  return {
    ArticleSectionImageSet: () => <Text>ArticleSectionImageSet</Text>,
  }
})

jest.mock("app/Scenes/Article/Components/Sections/ArticleSectionEmbed", () => {
  const { Text } = require("react-native")
  return {
    ArticleSectionEmbed: () => <Text>ArticleSectionEmbed</Text>,
  }
})

describe("ArticleSection", () => {
  const { renderWithRelay } = setupTestWrapper<ArticleSectionTestQuery>({
    Component: ({ article }) => {
      return <ArticleSection article={article!} section={article!.sections[0]} />
    },
    query: graphql`
      query ArticleSectionTestQuery @relay_test_operation {
        article(id: "article-id") {
          ...ArticleSectionText_article
          sections {
            ...ArticleSection_section
          }
        }
      }
    `,
  })

  it("renders ArticleSectionText when __typename is ArticleSectionText", () => {
    renderWithRelay({
      Article: () => ({
        sections: [
          {
            __typename: "ArticleSectionText",
          },
        ],
      }),
    })

    expect(screen.getByText("ArticleSectionText")).toBeOnTheScreen()
  })

  it("renders ArticleSectionImageCollection when __typename is ArticleSectionImageCollection", () => {
    renderWithRelay({
      Article: () => ({
        sections: [
          {
            __typename: "ArticleSectionImageCollection",
          },
        ],
      }),
    })

    expect(screen.getByText("ArticleSectionImageCollection")).toBeOnTheScreen()
  })

  it("renders ArticleSectionImageSet when __typename is ArticleSectionImageSet", () => {
    renderWithRelay({
      Article: () => ({
        sections: [
          {
            __typename: "ArticleSectionImageSet",
          },
        ],
      }),
    })

    expect(screen.getByText("ArticleSectionImageSet")).toBeOnTheScreen()
  })

  it("renders ArticleSectionEmbed when __typename is ArticleSectionEmbed", () => {
    renderWithRelay({
      Article: () => ({
        sections: [
          {
            __typename: "ArticleSectionEmbed",
          },
        ],
      }),
    })

    expect(screen.getByText("ArticleSectionEmbed")).toBeOnTheScreen()
  })

  it("renders null for unknown __typename", () => {
    renderWithRelay({
      Article: () => ({
        sections: [
          {
            __typename: "UnknownType",
          },
        ],
      }),
    })

    expect(screen.queryByText("ArticleSectionText")).not.toBeOnTheScreen()
    expect(screen.queryByText("ArticleSectionImageCollection")).not.toBeOnTheScreen()
    expect(screen.queryByText("ArticleSectionImageSet")).not.toBeOnTheScreen()
    expect(screen.queryByText("ArticleSectionEmbed")).not.toBeOnTheScreen()
  })
})
