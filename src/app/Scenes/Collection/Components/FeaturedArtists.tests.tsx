import { fireEvent } from "@testing-library/react-native"
import { FeaturedArtistsTestsQuery } from "__generated__/FeaturedArtistsTestsQuery.graphql"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { postEventToProviders } from "app/utils/track/providers"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { CollectionFeaturedArtistsContainer as FeaturedArtists } from "./FeaturedArtists"

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
    const { queryByText } = await renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(env, {
      MarketingCollection: () => ({ ...FeaturedArtistCollectionFixture }),
    })

    expect(queryByText("Featured Artists")).toBeTruthy()

    expect(queryByText("Pablo Picasso")).toBeTruthy()
    expect(queryByText("Andy Warhol")).toBeTruthy()
    expect(queryByText("Joan Miro")).toBeTruthy()
    expect(queryByText("View all")).toBeTruthy()
  })

  it("does not render an EntityHeader for excluded artists", async () => {
    const { queryByText } = await renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(env, {
      MarketingCollection: () => ({
        ...FeaturedArtistCollectionFixture,
        featuredArtistExclusionIds: ["34534-andy-warhols-id", "2342-pablo-picassos-id"],
      }),
    })

    expect(queryByText("Featured Artists")).toBeTruthy()

    expect(queryByText("Joan Miro")).toBeTruthy()
    expect(queryByText("Andy Warhol")).toBeNull()
    expect(queryByText("Pablo Picasso")).toBeNull()
    expect(queryByText("Jean-Michel Basquiat")).toBeTruthy()
    expect(queryByText("Kenny Scharf")).toBeTruthy()
  })

  describe("when artist ids are explicitly requested", () => {
    it("does not render an EntityHeader for any non-requested artists", async () => {
      const { queryByText } = renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(env, {
        MarketingCollection: () => ({
          ...FeaturedArtistCollectionFixture,
          query: { id: "some-id", artistIDs: ["34534-andy-warhols-id"] },
        }),
      })

      expect(queryByText("Andy Warhol")).toBeTruthy()
      expect(queryByText("Joan Miro")).toBeNull()
      expect(queryByText("Pablo Picasso")).toBeNull()
    })
  })

  describe("View all", () => {
    it("shows more artists when 'View more' is tapped", async () => {
      const { getByText, queryByText } = renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(env, {
        MarketingCollection: () => ({
          ...FeaturedArtistCollectionFixture,
        }),
      })

      expect(queryByText("View all")).toBeTruthy()
      expect(queryByText("Jean-Michel Basquiat")).toBeNull()
      expect(queryByText("Kenny Scharf")).toBeNull()

      fireEvent.press(getByText("View all"))
      expect(navigate).toHaveBeenCalledWith("/collection/some-collection/artists")
    })

    it("tracks an event when 'View more' is tapped", async () => {
      const { getByText, queryByText } = renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(env, {
        MarketingCollection: () => ({
          ...FeaturedArtistCollectionFixture,
        }),
      })

      expect(queryByText("View all")).toBeTruthy()
      fireEvent.press(getByText("View all"))

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
