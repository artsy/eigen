import { screen } from "@testing-library/react-native"
import { CollectionsByCategoryFooterTestQuery } from "__generated__/CollectionsByCategoryFooterTestQuery.graphql"
import { CollectionsByCategoryFooter } from "app/Scenes/CollectionsByCategory/CollectionsByCategoryFooter"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useRoute: () => ({
    params: {
      category: "Medium",
    },
  }),
}))

describe("Footer", () => {
  const { renderWithRelay } = setupTestWrapper<CollectionsByCategoryFooterTestQuery>({
    Component: ({ categories }) => <CollectionsByCategoryFooter categories={categories!} />,
    query: graphql`
      query CollectionsByCategoryFooterTestQuery {
        categories: discoveryCategoriesConnection {
          ...CollectionsByCategoryFooter_category
        }
      }
    `,
  })

  it("renders explore more categories text", () => {
    renderWithRelay({
      DiscoveryCategoriesConnectionConnection: () => ({
        edges: [
          {
            node: {
              title: "Movement",
              category: "Movement",
            },
          },
          {
            node: {
              title: "Size",
              category: "Size",
            },
          },
          {
            node: {
              title: "Color",
              category: "Color",
            },
          },
          {
            node: {
              title: "Price",
              category: "Price",
            },
          },
          {
            node: {
              title: "Gallery",
              category: "Gallery",
            },
          },
          {
            node: {
              title: "Medium",
              category: "Medium",
            },
          },
        ],
      }),
    })

    expect(screen.getByText("Explore more categories")).toBeOnTheScreen()
  })

  it("renders other categories excluding current one", () => {
    renderWithRelay({
      DiscoveryCategoriesConnectionConnection: () => ({
        edges: [
          {
            node: {
              title: "Movement",
              category: "Movement",
            },
          },
          {
            node: {
              title: "Size",
              category: "Size",
            },
          },
          {
            node: {
              title: "Color",
              category: "Color",
            },
          },
          {
            node: {
              title: "Price",
              category: "Price",
            },
          },
          {
            node: {
              title: "Gallery",
              category: "Gallery",
            },
          },
          {
            node: {
              title: "Medium",
              category: "Medium",
            },
          },
        ],
      }),
    })

    expect(screen.getByText("Movement")).toBeOnTheScreen()
    expect(screen.getByText("Size")).toBeOnTheScreen()
    expect(screen.getByText("Color")).toBeOnTheScreen()
    expect(screen.getByText("Price")).toBeOnTheScreen()
    expect(screen.getByText("Gallery")).toBeOnTheScreen()
    expect(screen.queryByText("Medium")).not.toBeOnTheScreen()
  })
})
