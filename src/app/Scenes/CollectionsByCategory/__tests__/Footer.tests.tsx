import { screen } from "@testing-library/react-native"
import { FooterCollectionsByCategoryTestQuery } from "__generated__/FooterCollectionsByCategoryTestQuery.graphql"
import { Footer } from "app/Scenes/CollectionsByCategory/Footer"
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
  const { renderWithRelay } = setupTestWrapper<FooterCollectionsByCategoryTestQuery>({
    Component: ({ categories }) => <Footer categories={categories!} />,
    query: graphql`
      query FooterCollectionsByCategoryTestQuery {
        categories: discoveryCategoriesConnection {
          ...Footer_category
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
