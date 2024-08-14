import { screen } from "@testing-library/react-native"
import { CollectionHeaderTestsQuery } from "__generated__/CollectionHeaderTestsQuery.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { CollectionFixture } from "app/Scenes/Collection/Components/__fixtures__/CollectionFixture"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
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

  describe("when the feature flag is enabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        AREnableCollectionsWithoutHeaderImage: true,
      })
    })

    it("passes the collection header image url to collection header", () => {
      renderWithRelay({ MarketingCollection: () => CollectionFixture })

      expect(screen.UNSAFE_queryByType(OpaqueImageView)).not.toBeTruthy()
    })

    it("passes the url of the most marketable artwork in the collection to the collection header when there is no headerImage value present", () => {
      renderWithRelay({
        MarketingCollection: () => ({
          ...CollectionFixture,
          headerImage: null,
        }),
      })

      expect(screen.UNSAFE_queryByType(OpaqueImageView)).not.toBeOnTheScreen()
    })
  })

  describe("when the feature flag is disabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        AREnableCollectionsWithoutHeaderImage: false,
      })
    })

    it("passes the collection header image url to collection header", () => {
      renderWithRelay({ MarketingCollection: () => CollectionFixture })

      expect(screen.UNSAFE_queryByType(OpaqueImageView)).toBeTruthy()
      expect(screen.UNSAFE_getByType(OpaqueImageView)).toHaveProp(
        "imageURL",
        "http://imageuploadedbymarketingteam.jpg"
      )
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

  it("passes the collection header title to collection header", () => {
    renderWithRelay({ MarketingCollection: () => CollectionFixture })

    expect(screen.getByText("Street Art Now")).toBeOnTheScreen()
  })
})
