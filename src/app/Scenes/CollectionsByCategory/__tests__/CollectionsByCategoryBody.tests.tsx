import { screen } from "@testing-library/react-native"
import { CollectionsByCategoryBodyTestQuery } from "__generated__/CollectionsByCategoryBodyTestQuery.graphql"
import { CollectionsByCategoryBody } from "app/Scenes/CollectionsByCategory/CollectionsByCategoryBody"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useRoute: () => ({
    params: { category: "mock-category", title: "Category" },
  }),
}))

jest.mock("app/Scenes/CollectionsByCategory/CollectionRail", () => ({
  CollectionRailWithSuspense: () => null,
  CollectionRailPlaceholder: () => null,
}))

describe("Body", () => {
  const { renderWithRelay } = setupTestWrapper<CollectionsByCategoryBodyTestQuery>({
    Component: ({ viewer }) => <CollectionsByCategoryBody viewer={viewer} />,
    query: graphql`
      query CollectionsByCategoryBodyTestQuery {
        viewer @required(action: NONE) {
          ...CollectionsByCategoryBody_viewer
        }
      }
    `,
  })

  it("renders", () => {
    renderWithRelay()

    expect(screen.getByText(/Explore collections by category/)).toBeOnTheScreen()
    expect(screen.getByText(/<mock-value-for-field-"title">/)).toBeOnTheScreen()
  })
})
