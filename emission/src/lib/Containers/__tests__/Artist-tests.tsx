import { Artist_artist } from "__generated__/Artist_artist.graphql"
import { StickyTab } from "lib/Components/StickyTabPage/StickyTabPageTabBar"
import Artist from "lib/Containers/Artist"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import "react-native"
import { graphql } from "react-relay"

jest.unmock("react-relay")

describe("availableTabs", () => {
  const getWrapper = async (artist: Omit<Artist_artist, " $fragmentRefs">) =>
    await renderRelayTree({
      Component: (props: any) => {
        return <Artist isPad={false} artist={{ ...artist }} {...props} />
      },
      query: graphql`
        query ArtistTestsQuery($isPad: Boolean!) @raw_response_type {
          artist(id: "andy-warhol") {
            ...Artist_artist
          }
        }
      `,
      variables: {
        isPad: false,
      },
      mockData: {
        artist,
      },
    })

  it("returns nothing if artist has no metadata, shows, or works", async () => {
    const wrapper = await getWrapper(ArtistFixture as any)
    expect(wrapper.find(StickyTab).length).toEqual(0)
  })

  it("returns About tab if artist has metadata", async () => {
    const wrapper = await getWrapper({ ...ArtistFixture, has_metadata: true } as any)
    expect(wrapper.find(StickyTab).length).toEqual(1)
    expect(wrapper.find(StickyTab).text()).toContain("About")
  })

  it("returns About tab if artist has articles", async () => {
    const wrapper = await getWrapper({
      ...ArtistFixture,
      counts: {
        artworks: 0,
        partner_shows: 0,
        related_artists: 0,
        articles: 1,
        follows: 0,
      },
      articles: {
        edges: [
          {
            node: {
              thumbnail_title: "Record-Breaking Ed Ruscha Brings in $52.4 Million at Christie’s",
              href: "/article/artsy-editorial-record-breaking-ruscha-brings-524-million-christies",
              author: {
                name: "Artsy Editorial",
              },
              thumbnail_image: {
                url:
                  "https://artsy-media-uploads.s3.amazonaws.com/7AcSnA5B-WhzwL_lvogGTA%2Fcustom-Custom_Size___Lot+6%2C+Ruscha%2C+Hurting+the+Word+Radio+%232.jpg",
              },
            },
          },
        ],
      },
    } as any)
    expect(wrapper.find(StickyTab).length).toEqual(1)
    expect(wrapper.find(StickyTab).text()).toContain("About")
  })

  it("returns Shows tab if artist has shows", async () => {
    const wrapper = await getWrapper({
      ...ArtistFixture,
      counts: {
        artworks: 0,
        partner_shows: 2,
        related_artists: 0,
        articles: 0,
        follows: 0,
      },
      currentShows: {
        edges: [
          {
            node: {
              id: "U2hvdzo1OGE1M2YzYzc2MjJkZDQxNmY3YTNjNGQ=",
              slug: "leeum-samsung-museum-of-art-leeum-collection-beyond-space",
              href: "/show/leeum-samsung-museum-of-art-leeum-collection-beyond-space",
              is_fair_booth: false,
              cover_image: {
                url: "https://d32dm0rphc51dk.cloudfront.net/vlXf0LFyHT9wTe7ODTMuJg/large.jpg",
              },
              kind: "group",
              name: "Leeum Collection: Beyond Space",
              exhibition_period: "Aug 19, 2014 – Dec 31, 2999",
              status_update: null,
              status: "running",
              partner: {
                __typename: "Partner",
                name: "Leeum, Samsung Museum of Art",
              },
              location: {
                city: "Seoul ",
              },
            },
          },
        ],
      },
    } as any)
    expect(wrapper.find(StickyTab).length).toEqual(1)
    expect(wrapper.find(StickyTab).text()).toContain("Shows")
  })

  it("returns all three tabs if artist has metadata, works, and shows", async () => {
    const wrapper = await getWrapper({
      ...ArtistFixture,
      counts: {
        artworks: 2,
        partner_shows: 2,
        related_artists: 0,
        articles: 0,
        follows: 0,
      },
      has_metadata: true,
      artworks: {
        pageInfo: {
          hasNextPage: true,
          startCursor: "YXJyYXljb25uZWN0aW9uOjA=",
          endCursor: "YXJyYXljb25uZWN0aW9uOjA=",
        },
        edges: [
          {
            cursor: "YXJyYXljb25uZWN0aW9uOjA=",
            node: {
              slug: "andy-warhol-chanel-no-5-set-of-4",
              id: "QXJ0d29yazo1OTdmZjliYTJhODkzYTI1ZDgyNDRiYWM=",
              image: {
                aspectRatio: 0.77,
                url: "https://d32dm0rphc51dk.cloudfront.net/b3nN0Y0pvZXGE7DnktZttA/large.jpg",
                aspect_ratio: 0.77,
              },
              title: "Chanel No. 5 (set of 4)",
              date: "1997",
              sale_message: "Contact For Price",
              is_biddable: false,
              is_acquireable: false,
              is_offerable: false,
              sale: null,
              sale_artwork: null,
              artists: [
                {
                  name: "Andy Warhol",
                },
              ],
              partner: {
                __typename: "Partner",
                name: "EHC Fine Art",
              },
              href: "/artwork/andy-warhol-chanel-no-5-set-of-4",
            },
          },
        ],
      },
    } as any)
    expect(wrapper.find(StickyTab).length).toEqual(3)
    expect(
      wrapper
        .find(StickyTab)
        .at(0)
        .text()
    ).toContain("About")
    expect(
      wrapper
        .find(StickyTab)
        .at(1)
        .text()
    ).toContain("Artworks")
    expect(
      wrapper
        .find(StickyTab)
        .at(2)
        .text()
    ).toContain("Shows")
  })
})

const ArtistFixture = {
  internalID: "4d8b92b34eb68a1b2c0003f4",
  slug: "andy-warhol",
  hasMetadata: true,
  counts: {
    artworks: 0,
    partner_shows: 0,
    related_artists: 0,
    articles: 0,
    follows: 0,
  },
  id: "QXJ0aXN0OjRkOGI5MmIzNGViNjhhMWIyYzAwMDNmNA==",
  isFollowed: false,
  name: "Andy Warhol",
  nationality: "American",
  birthday: "1928",
  has_metadata: false,
  is_display_auction_link: true,
  bio: "American, 1928-1987, Pittsburgh, PA, United States, based in New York, NY, United States",
  blurb:
    "Obsessed with [celebrity](/collection/andy-warhol-celebrity-portraits), consumer culture, and mechanical (re)production, [Pop artist](/gene/pop-art) Andy Warhol created some of the most iconic images of the 20th century. As famous for his quips as for his art—he variously mused that “art is what you can get away with” and “everyone will be famous for 15 minutes”—Warhol drew widely from popular culture and everyday subject matter, creating works like his [_32 Campbell's Soup Cans_](/collection/andy-warhol-campbells-soup-can) (1962), [Brillo pad box sculptures](/collection/andy-warhol-brillo-boxes), and portraits of [Marilyn Monroe](/collection/andy-warhol-marilyn-monroe), using the medium of silk-screen printmaking to achieve his characteristic hard edges and flat areas of color. Known for his cultivation of celebrity, Factory studio (a radical social and creative melting pot), and avant-garde films like _Chelsea Girls_ (1966), Warhol was also a mentor to artists like [Keith Haring](/artist/keith-haring) and [Jean-Michel Basquiat](/artist/jean-michel-basquiat). His Pop sensibility is now standard practice, taken up by major contemporary artists [Richard Prince](/artist/richard-prince), [Takashi Murakami](/artist/takashi-murakami), and [Jeff Koons](/artist/jeff-koons), among countless others.",
  related: {
    artists: {
      edges: [],
    },
  },
  artworks: {
    edges: [],
    pageInfo: {
      hasNextPage: false,
      startCursor: "",
      endCursor: "",
    },
  },
  articles: {
    edges: [],
  },
  currentShows: {
    edges: [],
  },
  upcomingShows: {
    edges: [],
  },
  pastSmallShows: {
    edges: [],
  },
  pastLargeShows: {
    edges: [],
  },
}
