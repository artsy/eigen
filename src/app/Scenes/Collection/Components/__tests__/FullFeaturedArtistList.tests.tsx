import { screen } from "@testing-library/react-native"
import { FullFeaturedArtistListTestsQuery } from "__generated__/FullFeaturedArtistListTestsQuery.graphql"
import { CollectionFeaturedArtistsContainer as CollectionFeaturedArtists } from "app/Scenes/Collection/Components/FullFeaturedArtistList"
import { FullFeaturedArtistListCollectionFixture } from "app/Scenes/Collection/Components/__fixtures__/CollectionFixture"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("FullFeaturedArtistList", () => {
  const { renderWithRelay } = setupTestWrapper<FullFeaturedArtistListTestsQuery>({
    Component: (props) => {
      if (props?.marketingCollection) {
        return <CollectionFeaturedArtists collection={props.marketingCollection} />
      }

      return null
    },
    query: graphql`
      query FullFeaturedArtistListTestsQuery @relay_test_operation @raw_response_type {
        marketingCollection(slug: "emerging-photographers") {
          ...FullFeaturedArtistList_collection
        }
      }
    `,
  })

  it("renders featured artist", async () => {
    await renderWithRelay({
      MarketingCollection: () => FullFeaturedArtistListCollectionFixture,
    })

    expect(screen.getByText("Pablo Picasso")).toBeTruthy()
    expect(screen.getByText("Andy Warhol")).toBeTruthy()
    expect(screen.getByText("Joan Miro")).toBeTruthy()
    expect(screen.getByText("Jean-Michel Basquiat")).toBeTruthy()
    expect(screen.getByText("Kenny Scharf")).toBeTruthy()
  })

  it("does not render an EntityHeader for excluded artists", async () => {
    await renderWithRelay({
      MarketingCollection: () => ({
        ...FullFeaturedArtistListCollectionFixture,
        featuredArtistExclusionIds: ["34534-andy-warhols-id", "2342-pablo-picassos-id"],
      }),
    })

    expect(screen.getByText("Joan Miro")).toBeTruthy()
    expect(screen.getByText("Jean-Michel Basquiat")).toBeTruthy()
    expect(screen.getByText("Kenny Scharf")).toBeTruthy()
    expect(screen.queryByText("Andy Warhol")).toBeFalsy()
    expect(screen.queryByText("Pablo Picasso")).toBeFalsy()
  })

  describe("when artist ids are explicitly requested", () => {
    it("does not render an EntityHeader for any non-requested artists", async () => {
      await renderWithRelay({
        MarketingCollection: () => ({
          ...FullFeaturedArtistListCollectionFixture,
          query: {
            id: "some-id",
            artistIDs: ["34534-andy-warhols-id"],
          },
        }),
      })

      expect(screen.getByText("Andy Warhol")).toBeTruthy()
      expect(screen.queryByText("Joan Miro")).toBeFalsy()
      expect(screen.queryByText("Pablo Picasso")).toBeFalsy()
    })
  })
})
