import { screen } from "@testing-library/react-native"
import { CollectionHeaderTestsQuery } from "__generated__/CollectionHeaderTestsQuery.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { CollectionFixture } from "app/Scenes/Collection/Components/__fixtures__/CollectionFixture"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { CollectionHeader } from "./CollectionHeader"

describe("collection header", () => {
  const { renderWithRelay } = setupTestWrapper<CollectionHeaderTestsQuery>({
    Component: ({ marketingCollection }) => <CollectionHeader collection={marketingCollection!} />,
    query: graphql`
      query CollectionHeaderTestsQuery @relay_test_operation {
        marketingCollection(slug: "street-art-now") {
          ...CollectionHeader_collection
        }
      }
    `,
  })

  it("passes the collection header image url to collection header", () => {
    renderWithRelay({ MarketingCollection: () => CollectionFixture })

    expect(screen.UNSAFE_queryByType(OpaqueImageView)).toBeTruthy()
    expect(screen.UNSAFE_getByType(OpaqueImageView)).toHaveProp(
      "imageURL",
      "http://imageuploadedbymarketingteam.jpg"
    )
  })

  it("passes the collection header title to collection header", () => {
    renderWithRelay({ MarketingCollection: () => CollectionFixture })

    expect(screen.getByText("Street Art Now")).toBeOnTheScreen()
  })

  it("passes the url of the most marketable artwork in the collection to the collection header when there is no headerImage value present", () => {
    renderWithRelay({
      MarketingCollection: () => ({
        ...CollectionFixture,
        headerImage: null,
      }),
    })

    expect(screen.UNSAFE_queryByType(OpaqueImageView)).toBeOnTheScreen()
    expect(screen.UNSAFE_getByType(OpaqueImageView)).toHaveProp(
      "imageURL",
      "https://defaultmostmarketableartworkincollectionimage.jpg"
    )
  })
})
