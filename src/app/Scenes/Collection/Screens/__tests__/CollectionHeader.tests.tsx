import { screen } from "@testing-library/react-native"
import { CollectionHeaderTestsQuery } from "__generated__/CollectionHeaderTestsQuery.graphql"
import { CollectionFixture } from "app/Scenes/Collection/Components/__fixtures__/CollectionFixture"
import { CollectionHeader } from "app/Scenes/Collection/Screens/CollectionHeader"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

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

    it("doesn't render the collection header image url to collection header", () => {
      renderWithRelay({ MarketingCollection: () => CollectionFixture })

      expect(screen.queryByTestId("header-image")).not.toBeOnTheScreen()
    })

    it("doesn't render the image of the most marketable artwork in the collection to the collection header when there is no headerImage value present", () => {
      renderWithRelay({
        MarketingCollection: () => ({
          ...CollectionFixture,
          headerImage: null,
        }),
      })

      expect(screen.UNSAFE_queryByProps({ testID: "header-image" })).not.toBeOnTheScreen()
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

      expect(screen.getByTestId("header-image")).toBeOnTheScreen()
    })

    it("renders the image of the most marketable artwork in the collection to the collection header when there is no headerImage value present", () => {
      renderWithRelay({
        MarketingCollection: () => ({
          ...CollectionFixture,
          headerImage: null,
        }),
      })

      expect(screen.getByTestId("header-image")).toBeOnTheScreen()
    })
  })

  it("passes the collection header title to collection header", () => {
    renderWithRelay({ MarketingCollection: () => CollectionFixture })

    expect(screen.getByText("Street Art Now")).toBeOnTheScreen()
  })
})
