import { renderRelayTree } from "lib/tests/renderRelayTree"
import { graphql } from "react-relay"
import Show from "../"

jest.unmock("react-relay")

it("Renders a show", async () => {
  const tree = await renderRelayTree({
    Component: Show,
    query: graphql`
      query indexTestsQuery @raw_response_type {
        show(id: "art-gallery-pure-art-of-design-at-art-gallery-pure") {
          ...Show_show
        }
      }
    `,
    mockData: {
      show: {
        description: "A show description",
        name: "Show name",
        is_followed: false,
        end_at: "2018-10-30T12:00:00+00:00",
        exhibition_period: "Jul 1 – Oct 30",
        isStubShow: false,
        partner: {
          __typename: "Partner",
          name: "Two Palms",
          id: "UGFydG5lcjp0d28tcGFsbXM=",
          website: "",
          type: "Partner",
          href: "shows/two-palms",
        },
        coverImage: null,
        images: [],
        followedArtist: {
          edges: [],
        },
        artist: [],
        counts: { artists: 0, artworks: 0 },
        artists_without_artworks: [],
        nearbyShows: { edges: [] },
        location: null,
        artistsWithoutArtworks: [],
        followedArtists: { edges: [] },
        artists: [],
        artworks: { edges: [] },
      },
    },
  })

  expect(tree.text()).toContain("Show name")
})
