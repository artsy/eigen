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

  it("renders featured artist", () => {
    const { getByText } = renderWithRelay({
      MarketingCollection: () => FullFeaturedArtistListCollectionFixture,
    })

    expect(getByText("Pablo Picasso")).toBeTruthy()
    expect(getByText("Andy Warhol")).toBeTruthy()
    expect(getByText("Joan Miro")).toBeTruthy()
    expect(getByText("Jean-Michel Basquiat")).toBeTruthy()
    expect(getByText("Kenny Scharf")).toBeTruthy()
  })

  it("does not render an EntityHeader for excluded artists", async () => {
    const { getByText, queryByText } = renderWithRelay({
      MarketingCollection: () => ({
        ...FullFeaturedArtistListCollectionFixture,
        featuredArtistExclusionIds: ["34534-andy-warhols-id", "2342-pablo-picassos-id"],
      }),
    })

    expect(getByText("Joan Miro")).toBeTruthy()
    expect(getByText("Jean-Michel Basquiat")).toBeTruthy()
    expect(getByText("Kenny Scharf")).toBeTruthy()
    expect(queryByText("Andy Warhol")).toBeFalsy()
    expect(queryByText("Pablo Picasso")).toBeFalsy()
  })

  describe("when artist ids are explicitly requested", () => {
    it("does not render an EntityHeader for any non-requested artists", async () => {
      const { getByText, queryByText } = renderWithRelay({
        MarketingCollection: () => ({
          ...FullFeaturedArtistListCollectionFixture,
          query: {
            id: "some-id",
            artistIDs: ["34534-andy-warhols-id"],
          },
        }),
      })

      expect(getByText("Andy Warhol")).toBeTruthy()
      expect(queryByText("Joan Miro")).toBeFalsy()
      expect(queryByText("Pablo Picasso")).toBeFalsy()
    })
  })
})
