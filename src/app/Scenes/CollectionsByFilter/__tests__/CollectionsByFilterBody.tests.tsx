import { screen } from "@testing-library/react-native"
import { CollectionsByFilterBodyTestQuery } from "__generated__/CollectionsByFilterBodyTestQuery.graphql"
import { CollectionsByFilterBody } from "app/Scenes/CollectionsByFilter/CollectionsByFilterBody"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useRoute: () => ({
    params: { category: "mock-category", title: "Mock Category", slug: "mock-slug" },
  }),
}))

describe("CollectionsByFilterBody", () => {
  const { renderWithRelay } = setupTestWrapper<CollectionsByFilterBodyTestQuery>({
    Component: ({ viewer }) => <CollectionsByFilterBody viewer={viewer as any} />,
    query: graphql`
      query CollectionsByFilterBodyTestQuery @relay_test_operation {
        viewer {
          ...CollectionsByFilterBody_viewer @arguments(categorySlug: "test")
        }
      }
    `,
  })

  it("renders", () => {
    renderWithRelay()

    expect(screen.getByText("Mock Category")).toBeOnTheScreen()
    expect(screen.getByText("Explore collections by mock category")).toBeOnTheScreen()
    expect(screen.getAllByText(/mock-value-for-field-"title"/).length).toBeGreaterThan(0)
    expect(screen.getByText(/mock-Value-for-Field-"Title"/)).toBeOnTheScreen()
  })
})
