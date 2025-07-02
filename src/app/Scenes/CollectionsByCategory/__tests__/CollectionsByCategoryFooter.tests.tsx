import { screen } from "@testing-library/react-native"
import { CollectionsByCategoryFooterTestQuery } from "__generated__/CollectionsByCategoryFooterTestQuery.graphql"
import { CollectionsByCategoryFooter } from "app/Scenes/CollectionsByCategory/CollectionsByCategoryFooter"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useRoute: () => ({
    params: {
      slug: "medium",
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
              slug: "movement",
            },
          },
          {
            node: {
              title: "Size",
              slug: "size",
            },
          },
          {
            node: {
              title: "Color",
              slug: "color",
            },
          },
          {
            node: {
              title: "Price",
              slug: "price",
            },
          },
          {
            node: {
              title: "Gallery",
              slug: "gallery",
            },
          },
          {
            node: {
              title: "Medium",
              slug: "medium",
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
              slug: "movement",
            },
          },
          {
            node: {
              title: "Size",
              slug: "size",
            },
          },
          {
            node: {
              title: "Color",
              slug: "color",
            },
          },
          {
            node: {
              title: "Price",
              slug: "price",
            },
          },
          {
            node: {
              title: "Gallery",
              slug: "gallery",
            },
          },
          {
            node: {
              title: "Medium",
              slug: "medium",
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
