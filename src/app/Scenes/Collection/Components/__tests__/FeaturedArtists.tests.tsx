import { fireEvent, screen } from "@testing-library/react-native"
import { FeaturedArtistsTestsQuery } from "__generated__/FeaturedArtistsTestsQuery.graphql"
import { CollectionFeaturedArtistsContainer as FeaturedArtists } from "app/Scenes/Collection/Components/FeaturedArtists"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { postEventToProviders } from "app/utils/track/providers"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

jest.unmock("react-tracking")

const FeaturedArtistCollectionFixture: FeaturedArtistsTestsQuery["rawResponse"]["marketingCollection"] =
  {
    id: "some-id",
    slug: "some-collection",
    artworksConnection: {
      id: "connection-id",
      merchandisableArtists: [
        {
          id: "2342-pablo-picassos-id",
          slug: "pablo-picasso",
          internalID: "2342-pablo-picassos-id",
          name: "Pablo Picasso",
          image: {
            url: "/some/resized/picasso/image/url",
          },
          coverArtwork: {
            id: "cover-artwork-picasso",
            image: {
              url: "https://example.com/picasso-cover.jpg",
            },
          },
          birthday: "1877",
          nationality: "American",
          is_followed: true,
          initials: "PP",
          href: "/a/link/to/picasso",
          deathday: "1973",
        },
        {
          id: "34534-andy-warhols-id",
          slug: "andy-warhol",
          internalID: "34534-andy-warhols-id",
          name: "Andy Warhol",
          image: {
            url: "/some/resized/warhol/image/url",
          },
          coverArtwork: {
            id: "cover-artwork-warhol",
            image: {
              url: "https://example.com/warhol-cover.jpg",
            },
          },
          birthday: "1947",
          nationality: "American",
          is_followed: true,
          initials: "AW",
          href: "/a/link/to/warhol",
          deathday: "1987",
        },
        {
          id: "3454",
          slug: "joan-miro",
          internalID: "3454",
          name: "Joan Miro",
          image: {
            url: "/some/resized/miro/image/url",
          },
          coverArtwork: {
            id: "cover-artwork-miro",
            image: {
              url: "https://example.com/miro-cover.jpg",
            },
          },
          birthday: "1877",
          nationality: "Spanish",
          is_followed: true,
          initials: "JM",
          href: "/a/link/to/miro",
          deathday: "1983",
        },
        {
          id: "9807",
          slug: "jean-michel-basquiat",
          internalID: "9807",
          name: "Jean-Michel Basquiat",
          image: {
            url: "/some/resized/basquiat/image/url",
          },
          coverArtwork: {
            id: "cover-artwork-basquiat",
            image: {
              url: "https://example.com/basquiat-cover.jpg",
            },
          },
          birthday: "1960",
          nationality: "American",
          is_followed: false,
          initials: "JMB",
          href: "/a/link/to/basquiat",
          deathday: "2001",
        },
        {
          id: "0120",
          slug: "kenny-scharf",
          internalID: "0120",
          name: "Kenny Scharf",
          image: {
            url: "/some/resized/scharf/image/url",
          },
          coverArtwork: {
            id: "cover-artwork-scharf",
            image: {
              url: "https://example.com/scharf-cover.jpg",
            },
          },
          birthday: "1958",
          nationality: "American",
          is_followed: false,
          initials: "KS",
          href: "/a/link/to/scharf",
          deathday: null,
        },
      ],
    },
    featuredArtistExclusionIds: [],
    query: {
      artistIDs: [],
    },
  }

describe("FeaturedArtists", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => {
    return (
      <QueryRenderer<FeaturedArtistsTestsQuery>
        environment={env}
        variables={{}}
        render={({ props, error }) => {
          if (props) {
            return <FeaturedArtists collection={props.marketingCollection!} />
          } else if (error) {
            console.log(error)
            return
          }
        }}
        query={graphql`
          query FeaturedArtistsTestsQuery @raw_response_type {
            marketingCollection(slug: "emerging-photographers") {
              ...FeaturedArtists_collection
            }
          }
        `}
      />
    )
  }

  it("renders an EntityHeader for each featured artist", async () => {
    renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(env, {
      MarketingCollection: () => ({ ...FeaturedArtistCollectionFixture }),
    })

    expect(screen.getByText("Featured Artists")).toBeOnTheScreen()

    expect(screen.getByText("Pablo Picasso")).toBeOnTheScreen()
    expect(screen.getByText("Andy Warhol")).toBeOnTheScreen()
    expect(screen.getByText("Joan Miro")).toBeOnTheScreen()
    expect(screen.getByText("View all")).toBeOnTheScreen()
  })

  it("does not render an EntityHeader for excluded artists", async () => {
    renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(env, {
      MarketingCollection: () => ({
        ...FeaturedArtistCollectionFixture,
        featuredArtistExclusionIds: ["34534-andy-warhols-id", "2342-pablo-picassos-id"],
      }),
    })

    expect(screen.getByText("Featured Artists")).toBeOnTheScreen()

    expect(screen.getByText("Joan Miro")).toBeOnTheScreen()
    expect(screen.queryByText("Andy Warhol")).toBeNull()
    expect(screen.queryByText("Pablo Picasso")).toBeNull()
    expect(screen.getByText("Jean-Michel Basquiat")).toBeOnTheScreen()
    expect(screen.getByText("Kenny Scharf")).toBeOnTheScreen()
  })

  describe("when artist ids are explicitly requested", () => {
    it("does not render an EntityHeader for any non-requested artists", async () => {
      renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(env, {
        MarketingCollection: () => ({
          ...FeaturedArtistCollectionFixture,
          query: { id: "some-id", artistIDs: ["34534-andy-warhols-id"] },
        }),
      })

      expect(screen.getByText("Andy Warhol")).toBeOnTheScreen()
      expect(screen.queryByText("Joan Miro")).toBeNull()
      expect(screen.queryByText("Pablo Picasso")).toBeNull()
    })
  })

  describe("View all", () => {
    it("shows more artists when 'View more' is tapped", async () => {
      renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(env, {
        MarketingCollection: () => ({
          ...FeaturedArtistCollectionFixture,
        }),
      })

      expect(screen.getByText("View all")).toBeOnTheScreen()
      expect(screen.queryByText("Jean-Michel Basquiat")).toBeNull()
      expect(screen.queryByText("Kenny Scharf")).toBeNull()

      fireEvent.press(screen.getByText("View all"))
      expect(navigate).toHaveBeenCalledWith("/collection/some-collection/artists")
    })

    it("tracks an event when 'View more' is tapped", async () => {
      renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(env, {
        MarketingCollection: () => ({
          ...FeaturedArtistCollectionFixture,
        }),
      })

      expect(screen.getByText("View all")).toBeOnTheScreen()
      fireEvent.press(screen.getByText("View all"))

      expect(postEventToProviders).toHaveBeenCalledWith({
        action_type: "tap",
        action_name: "viewMore",
        context_module: "FeaturedArtists",
        context_screen: "Collection",
        flow: "FeaturedArtists",
      })
    })
  })
})
