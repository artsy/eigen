import { DetailTestsQueryRawResponse } from "__generated__/DetailTestsQuery.graphql"
import { FilteredInfiniteScrollGridTestsQueryRawResponse } from "__generated__/FilteredInfiniteScrollGridTestsQuery.graphql"
import { FiltersTestsQueryRawResponse } from "__generated__/FiltersTestsQuery.graphql"
import { MoreInfoTestsQueryRawResponse } from "__generated__/MoreInfoTestsQuery.graphql"
import { ShowArtistsPreviewTestsQueryRawResponse } from "__generated__/ShowArtistsPreviewTestsQuery.graphql"
import { ShowArtistsTestsQueryRawResponse } from "__generated__/ShowArtistsTestsQuery.graphql"
import { ShowArtworksPreviewTestsQueryRawResponse } from "__generated__/ShowArtworksPreviewTestsQuery.graphql"
import { ShowArtworksTestsQueryRawResponse } from "__generated__/ShowArtworksTestsQuery.graphql"
import { ShowEventSectionTestsQueryRawResponse } from "__generated__/ShowEventSectionTestsQuery.graphql"
import { ShowTestsQueryRawResponse } from "__generated__/ShowTestsQuery.graphql"

export const ShowFixture: ShowArtworksTestsQueryRawResponse["show"] &
  ShowTestsQueryRawResponse["show"] &
  ShowArtistsTestsQueryRawResponse["show"] &
  MoreInfoTestsQueryRawResponse["show"] &
  DetailTestsQueryRawResponse["show"] &
  ShowEventSectionTestsQueryRawResponse["show"] &
  ShowArtworksPreviewTestsQueryRawResponse["show"] &
  ShowArtistsPreviewTestsQueryRawResponse["show"] &
  FiltersTestsQueryRawResponse["show"] &
  FilteredInfiniteScrollGridTestsQueryRawResponse["show"] = {
  id: "2sdlfkjslfkjsdf23lkfjeslkfjdslkfjs",
  slug: "anderson-fine-art-gallery-flickinger-collection",
  internalID: "5b368a02275b245afc034d6f",
  openingReceptionText: "",
  isStubShow: false,
  is_followed: false,
  end_at: "2018-10-30T12:00:00+00:00",
  pressReleaseUrl: "https://example.com",
  location: {
    id: "TG9jYXRpb246NWIzNjQ2NjRjYjRjMjcxNzQzNDkwMTkx",
    internalID: "5b364664cb4c271743490191",
    city: "Sea Island ",
    address: "Online Exclusive",
    address_2: "",
    coordinates: null,
    day_schedules: [],
    summary: "",
    openingHours: {
      __typename: "OpeningHoursText",
      text: "",
    },
    postal_code: "",
  },
  nearbyShows: {
    edges: [],
  },
  partner: {
    __typename: "Partner",
    name: "Two Palms",
    id: "UGFydG5lcjp0d28tcGFsbXM=",
    website: "",
    type: "Partner",
    href: "shows/two-palms",
  },
  artists_without_artworks: [
    {
      id: "QXJ0aXN0OnNhbS1mcmFuY2lz",
      internalID: "4d8b92854eb68a1b2c0001b8",
      slug: "sam-francis",
      name: "Sam Francis",
      initials: "SF",
      is_followed: false,
      href: "/artist/sam-francis",
      nationality: "American",
      birthday: "1923",
      deathday: "1994",
      image: {
        url: "https://d32dm0rphc51dk.cloudfront.net/wZ9dabmVZjtcaB_q_bKKzw/tall.jpg",
      },
    },
  ],
  artistsWithoutArtworks: [
    {
      id: "QXJ0aXN0OnNhbS1mcmFuY2lz",
      slug: "sam-francis",
    },
  ],
  followedArtists: {
    edges: [
      {
        node: {
          artist: {
            id: "QXJ0aXN0OmhhbnMtaG9mbWFubg==",
            internalID: "4d8b92614eb68a1b2c000064",
            slug: "hans-hofmann",
            name: "Hans Hofmann",
            href: "/artist/hans-hofmann",
          },
        },
      },
      {
        node: {
          artist: {
            id: "QXJ0aXN0OnNhbS1mcmFuY2lz",
            internalID: "4d8b92854eb68a1b2c0001b8",
            slug: "sam-francis",
            name: "Sam Francis",
            href: "/artist/sam-francis",
          },
        },
      },
      {
        node: {
          artist: {
            id: "QXJ0aXN0OnBhYmxvLXBpY2Fzc28=",
            internalID: "4d8b928b4eb68a1b2c0001f2",
            slug: "pablo-picasso",
            name: "Pablo Picasso",
            href: "/artist/pablo-picasso",
          },
        },
      },
    ],
  },
  artists: [
    {
      id: "QXJ0aXN0OmhhbnMtaG9mbWFubg==",
      internalID: "4d8b92614eb68a1b2c000064",
      slug: "hans-hofmann",
      name: "Hans Hofmann",
      is_followed: false,
      initials: "HH",
      href: "/artist/hans-hofmann",
      nationality: "German-American",
      birthday: "1880",
      deathday: "1966",
      image: {
        url: "https://d32dm0rphc51dk.cloudfront.net/vRQdNHjLuWKadBXy9Fl4Pg/tall.jpg",
      },
    },
    {
      id: "QXJ0aXN0OmRhdmlkLWhvY2tuZXk=",
      internalID: "4d8b92854eb68a1b2c0001b6",
      slug: "david-hockney",
      name: "David Hockney",
      is_followed: false,
      initials: "DH",
      href: "/artist/david-hockney",
      nationality: "British",
      birthday: "1937",
      deathday: "",
      image: {
        url: "https://d32dm0rphc51dk.cloudfront.net/kCJVZo7bcqVrjnQ22QHhvg/tall.jpg",
      },
    },
    {
      id: "QXJ0aXN0OnNhbS1mcmFuY2lz",
      internalID: "4d8b92854eb68a1b2c0001b8",
      slug: "sam-francis",
      name: "Sam Francis",
      is_followed: false,
      initials: "SF",
      href: "/artist/sam-francis",
      nationality: "American",
      birthday: "1923",
      deathday: "1994",
      image: {
        url: "https://d32dm0rphc51dk.cloudfront.net/wZ9dabmVZjtcaB_q_bKKzw/tall.jpg",
      },
    },
    {
      id: "QXJ0aXN0OnBhYmxvLXBpY2Fzc28=",
      internalID: "4d8b928b4eb68a1b2c0001f2",
      slug: "pablo-picasso",
      name: "Pablo Picasso",
      is_followed: false,
      initials: "PP",
      href: "/artist/pablo-picasso",
      nationality: "Spanish",
      birthday: "1881",
      deathday: "1973",
      image: {
        url: "https://d32dm0rphc51dk.cloudfront.net/i3rCA3IaKE-cLBnc-U5swQ/tall.jpg",
      },
    },
    {
      id: "QXJ0aXN0OndvbGYta2Fobg==",
      internalID: "4d8b928b4eb68a1b2c0001fa",
      slug: "wolf-kahn",
      name: "Wolf Kahn",
      is_followed: false,
      initials: "WK",
      href: "/artist/wolf-kahn",
      nationality: "American",
      birthday: "1927",
      deathday: "",
      image: {
        url: "https://d32dm0rphc51dk.cloudfront.net/pzYQSjFUn7MyELRIVyADjQ/tall.jpg",
      },
    },
    {
      id: "QXJ0aXN0OnJvYmVydC1tb3RoZXJ3ZWxs",
      internalID: "4d8b92a24eb68a1b2c000318",
      slug: "robert-motherwell",
      name: "Robert Motherwell",
      is_followed: false,
      initials: "SF",
      href: "/artist/robert-motherwell",
      nationality: "American",
      birthday: "1915",
      deathday: "1991",
      image: {
        url: "https://d32dm0rphc51dk.cloudfront.net/BbPC9SljRn-_6AfewiQpxw/tall.jpg",
      },
    },
    {
      id: "QXJ0aXN0OmppbS1kaW5l",
      internalID: "4d8d1266876c697ae1000050",
      slug: "jim-dine",
      name: "Jim Dine",
      is_followed: false,
      initials: "SF",
      href: "/artist/jim-dine",
      nationality: "American",
      birthday: "1935",
      deathday: "",
      image: {
        url: "https://d32dm0rphc51dk.cloudfront.net/Ll4gMf_OsLMehbgv05H6mw/tall.jpg",
      },
    },
    {
      id: "QXJ0aXN0OmVsbHN3b3J0aC1rZWxseQ==",
      internalID: "4dbe1873a671b202fd0001b3",
      slug: "ellsworth-kelly",
      name: "Ellsworth Kelly",
      initials: "SF",
      is_followed: false,
      href: "/artist/ellsworth-kelly",
      nationality: "American",
      birthday: "1923",
      deathday: "2015",
      image: {
        url: "https://d32dm0rphc51dk.cloudfront.net/Bv9Hh3cYTCvc76NnZS4w4g/tall.jpg",
      },
    },
    {
      id: "QXJ0aXN0OmJyaWRnZXQtcmlsZXk=",
      internalID: "4ddbb26110c9af00010018a7",
      slug: "bridget-riley",
      name: "Bridget Riley",
      is_followed: false,
      initials: "SF",
      href: "/artist/bridget-riley",
      nationality: "British",
      birthday: "1931",
      deathday: "",
      image: {
        url: "https://d32dm0rphc51dk.cloudfront.net/zLIFDjlzCw8ijOH9PPeasA/tall.jpg",
      },
    },
    {
      id: "QXJ0aXN0OnJpY2hhcmQtZGllYmVua29ybg==",
      internalID: "4df4438f81d91d0001002d9c",
      slug: "richard-diebenkorn",
      name: "Richard Diebenkorn",
      is_followed: false,
      initials: "SF",
      href: "/artist/richard-diebenkorn",
      nationality: "American",
      birthday: "1922",
      deathday: "1993",
      image: {
        url: "https://d32dm0rphc51dk.cloudfront.net/C5GfncAzGMsMf6A6RSfJEQ/tall.jpg",
      },
    },
    {
      id: "QXJ0aXN0OmthcmVsLWFwcGVs",
      internalID: "4df612a628eaa10001004397",
      slug: "karel-appel",
      name: "Karel Appel",
      is_followed: false,
      href: "/artist/karel-appel",
      initials: "SF",
      nationality: "Dutch",
      birthday: "1921",
      deathday: "2006",
      image: {
        url: "https://d32dm0rphc51dk.cloudfront.net/puxzysW1yY3FCRLFaLFEQQ/tall.jpg",
      },
    },
    {
      id: "QXJ0aXN0OmRhbGUtY2hpaHVseQ==",
      internalID: "4e97356d4e77d300010008fa",
      slug: "dale-chihuly",
      name: "Dale Chihuly",
      is_followed: false,
      initials: "SF",
      href: "/artist/dale-chihuly",
      nationality: "American",
      birthday: "1941",
      deathday: "",
      image: {
        url: "https://d32dm0rphc51dk.cloudfront.net/qfT1qZw8EGJguSakyhFxig/tall.jpg",
      },
    },
    {
      id: "QXJ0aXN0OnBvbGx5LWFwZmVsYmF1bQ==",
      internalID: "4f5f64c13b555230ac00003a",
      slug: "polly-apfelbaum",
      name: "Polly Apfelbaum",
      is_followed: false,
      initials: "SF",
      href: "/artist/polly-apfelbaum",
      nationality: "American",
      birthday: "1955",
      deathday: "",
      image: {
        url: "https://d32dm0rphc51dk.cloudfront.net/MByqc96STE-fJtW4mZpgSg/tall.jpg",
      },
    },
    {
      id: "QXJ0aXN0OmNhcm9seW4tYnJhZHk=",
      internalID: "506b3335446617000200054c",
      slug: "carolyn-brady",
      name: "Carolyn Brady",
      is_followed: false,
      initials: "SF",
      href: "/artist/carolyn-brady",
      nationality: "American",
      birthday: "1937",
      deathday: "2005",
      image: {
        url: "https://d32dm0rphc51dk.cloudfront.net/DH5Jtvy_a5d4Bb5hxB-Fxw/tall.jpg",
      },
    },
    {
      id: "QXJ0aXN0Om5lbGwtYmxhaW5l",
      internalID: "50c84c1e623327ed6c000c24",
      slug: "nell-blaine",
      name: "Nell Blaine",
      is_followed: false,
      href: "/artist/nell-blaine",
      initials: "SF",
      nationality: "American",
      birthday: "1922",
      deathday: "1996",
      image: {
        url: "https://d32dm0rphc51dk.cloudfront.net/jr4zSDi7sXllVBNVhQardw/tall.jpg",
      },
    },
    {
      id: "QXJ0aXN0OmJydWNlLWJlYXNsZXk=",
      internalID: "55fc7e16726169225600007c",
      slug: "bruce-beasley",
      name: "Bruce Beasley",
      is_followed: false,
      href: "/artist/bruce-beasley",
      initials: "SF",
      nationality: "American",
      birthday: "1939",
      deathday: "",
      image: {
        url: "https://d32dm0rphc51dk.cloudfront.net/XazCw3_7ZEQz-sdkLDWXjA/tall.jpg",
      },
    },
    {
      id: "QXJ0aXN0OnJvYmVydC1oYXJtcw==",
      internalID: "568453ce66fd1c650b000057",
      slug: "robert-harms",
      name: "Robert Harms",
      is_followed: false,
      href: "/artist/robert-harms",
      initials: "SF",
      nationality: "",
      birthday: "1962",
      deathday: "",
      image: {
        url: "https://d32dm0rphc51dk.cloudfront.net/i5_X3qJO8gFiyHrlHvAb-w/tall.jpg",
      },
    },
  ],
  artworks: {
    edges: [
      {
        node: {
          id: "QXJ0d29yazpjYXJvbHluLWJyYWR5LXN0b3VyaGVhZC1hY3Jvc3MtdGhlLWxha2U=",
          slug: "carolyn-brady-stourhead-across-the-lake",
          title: "Stourhead Across the Lake",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "carolyn-brady",
              name: "Carolyn Brady",
            },
          ],
          image: {
            aspect_ratio: 1.53,
            url: "https://d32dm0rphc51dk.cloudfront.net/tH19ZfyCDocnNsKzXOZfHg/medium.jpg",
          },
          href: "/artwork/carolyn-brady-stourhead-across-the-lake",
          sale: null,
          sale_message: "$15,000",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "1997",
        },
      },
      {
        node: {
          id: "QXJ0d29yazpyb2JlcnQtaGFybXMtYmx1ZmYtcm9hZA==",
          slug: "robert-harms-bluff-road",
          title: "Bluff Road",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "robert-harms",
              name: "Robert Harms",
            },
          ],
          image: {
            aspect_ratio: 1,
            url: "https://d32dm0rphc51dk.cloudfront.net/xU1Y9RXzBJ0TY6G0ZvbHHw/larger.jpg",
          },
          href: "/artwork/robert-harms-bluff-road",
          sale: null,
          sale_message: "Sold",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "1998",
        },
      },
      {
        node: {
          id: "QXJ0d29yazpqaW0tZGluZS1hbi1pbmZvcm1hbC10aWU=",
          slug: "jim-dine-an-informal-tie",
          title: "An Informal Tie",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "jim-dine",
              name: "Jim Dine",
            },
          ],
          image: {
            aspect_ratio: 0.51,
            url: "https://d32dm0rphc51dk.cloudfront.net/dBBr15AyJ13x5heIyctJIA/tall.jpg",
          },
          href: "/artwork/jim-dine-an-informal-tie",
          sale: null,
          sale_message: "$14,000",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "1961",
        },
      },
      {
        node: {
          id: "QXJ0d29yazpyaWNoYXJkLWRpZWJlbmtvcm4tYmx1ZS13aXRoLXJlZC0xNQ==",
          slug: "richard-diebenkorn-blue-with-red-15",
          title: "Blue with Red",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "richard-diebenkorn",
              name: "Richard Diebenkorn",
            },
          ],
          image: {
            aspect_ratio: 0.71,
            url: "https://d32dm0rphc51dk.cloudfront.net/txGh8F3S_CDBKt6QPtjIBw/larger.jpg",
          },
          href: "/artwork/richard-diebenkorn-blue-with-red-15",
          sale: null,
          sale_message: "Sold",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "1987",
        },
      },
      {
        node: {
          id: "QXJ0d29yazprYXJlbC1hcHBlbC1oYXBweS1naG9zdA==",
          slug: "karel-appel-happy-ghost",
          title: "Happy Ghost",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "karel-appel",
              name: "Karel Appel",
            },
          ],
          image: {
            aspect_ratio: 0.78,
            url: "https://d32dm0rphc51dk.cloudfront.net/SUPKae4rRR1ZWs5mc70QJg/larger.jpg",
          },
          href: "/artwork/karel-appel-happy-ghost",
          sale: null,
          sale_message: "$6,000",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "1960",
        },
      },
      {
        node: {
          id: "QXJ0d29yazpuZWxsLWJsYWluZS1hdWd1c3QtbGlnaHQ=",
          slug: "nell-blaine-august-light",
          title: "August Light",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "nell-blaine",
              name: "Nell Blaine",
            },
          ],
          image: {
            aspect_ratio: 1.46,
            url: "https://d32dm0rphc51dk.cloudfront.net/P_4Avd1FcPjMKJ_aJFA1WQ/medium.jpg",
          },
          href: "/artwork/nell-blaine-august-light",
          sale: null,
          sale_message: "$10,000",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "1989",
        },
      },
      {
        node: {
          id: "QXJ0d29yazpicnVjZS1iZWFzbGV5LXZveWFnZXI=",
          slug: "bruce-beasley-voyager",
          title: "Voyager",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "bruce-beasley",
              name: "Bruce Beasley",
            },
          ],
          image: {
            aspect_ratio: 0.71,
            url: "https://d32dm0rphc51dk.cloudfront.net/m7N4jeFJJr3FdFqU_0YDRg/medium.jpg",
          },
          href: "/artwork/bruce-beasley-voyager",
          sale: null,
          sale_message: "Sold",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "1999",
        },
      },
      {
        node: {
          id: "QXJ0d29yazpzYW0tZnJhbmNpcy11bmRlci1ibHVlLTM=",
          slug: "sam-francis-under-blue-3",
          title: "Under Blue",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "sam-francis",
              name: "Sam Francis",
            },
          ],
          image: {
            aspect_ratio: 1.35,
            url: "https://d32dm0rphc51dk.cloudfront.net/gz2wa9iBcZKB0ut6gMED1w/larger.jpg",
          },
          href: "/artwork/sam-francis-under-blue-3",
          sale: null,
          sale_message: "$12,000",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "1974",
        },
      },
      {
        node: {
          id: "QXJ0d29yazpjYXJvbHluLWJyYWR5LXRhbWFyaW5k",
          slug: "carolyn-brady-tamarind",
          title: "Tamarind",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "carolyn-brady",
              name: "Carolyn Brady",
            },
          ],
          image: {
            aspect_ratio: 1.33,
            url: "https://d32dm0rphc51dk.cloudfront.net/tkm-BtRS1igRoRUx5SdOOA/larger.jpg",
          },
          href: "/artwork/carolyn-brady-tamarind",
          sale: null,
          sale_message: "$4,500",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "1999",
        },
      },
      {
        node: {
          id: "QXJ0d29yazpyb2JlcnQtbW90aGVyd2VsbC1udW1iZXItOA==",
          slug: "robert-motherwell-number-8",
          title: "Number 8",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "robert-motherwell",
              name: "Robert Motherwell",
            },
          ],
          image: {
            aspect_ratio: 0.72,
            url: "https://d32dm0rphc51dk.cloudfront.net/u-Onw4lFPIgSERW9vkizjA/larger.jpg",
          },
          href: "/artwork/robert-motherwell-number-8",
          sale: null,
          sale_message: "$6,000",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "2000",
        },
      },
      {
        node: {
          id: "QXJ0d29yazplbGxzd29ydGgta2VsbHktZ3JlZW4tY3VydmUtMTQ=",
          slug: "ellsworth-kelly-green-curve-14",
          title: "Green Curve",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "ellsworth-kelly",
              name: "Ellsworth Kelly",
            },
          ],
          image: {
            aspect_ratio: 0.74,
            url: "https://d32dm0rphc51dk.cloudfront.net/Cut7VPHWKBilZ5Ivj5vJIg/larger.jpg",
          },
          href: "/artwork/ellsworth-kelly-green-curve-14",
          sale: null,
          sale_message: "$10,500",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "2000",
        },
      },
      {
        node: {
          id: "QXJ0d29yazp3b2xmLWthaG4taW4taXBzd2ljaC1tYXNz",
          slug: "wolf-kahn-in-ipswich-mass",
          title: "In Ipswich, Mass",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "wolf-kahn",
              name: "Wolf Kahn",
            },
          ],
          image: {
            aspect_ratio: 1.35,
            url: "https://d32dm0rphc51dk.cloudfront.net/qY9kBnLdh2EPkPZK8VuAaA/larger.jpg",
          },
          href: "/artwork/wolf-kahn-in-ipswich-mass",
          sale: null,
          sale_message: "$9,500",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "1987",
        },
      },
      {
        node: {
          id: "QXJ0d29yazpkYXZpZC1ob2NrbmV5LW15LXBvb2wtYW5kLXRlcnJhY2UtNA==",
          slug: "david-hockney-my-pool-and-terrace-4",
          title: "My Pool & Terrace",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "david-hockney",
              name: "David Hockney",
            },
          ],
          image: {
            aspect_ratio: 1.48,
            url: "https://d32dm0rphc51dk.cloudfront.net/05rL1DSRwbn9t43xoYkiLg/larger.jpg",
          },
          href: "/artwork/david-hockney-my-pool-and-terrace-4",
          sale: null,
          sale_message: "Sold",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "1983",
        },
      },
      {
        node: {
          id: "QXJ0d29yazp3b2xmLWthaG4tb3JjaGFyZC1hdC1kdXNr",
          slug: "wolf-kahn-orchard-at-dusk",
          title: "Orchard at Dusk",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "wolf-kahn",
              name: "Wolf Kahn",
            },
          ],
          image: {
            aspect_ratio: 1.25,
            url: "https://d32dm0rphc51dk.cloudfront.net/7YGi2ogpyQW4Vl9gorV0dQ/larger.jpg",
          },
          href: "/artwork/wolf-kahn-orchard-at-dusk",
          sale: null,
          sale_message: "$8,000",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "1989",
        },
      },
      {
        node: {
          id: "QXJ0d29yazpoYW5zLWhvZm1hbm4tdW50aXRsZWQtMjIx",
          slug: "hans-hofmann-untitled-221",
          title: "Untitled",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "hans-hofmann",
              name: "Hans Hofmann",
            },
          ],
          image: {
            aspect_ratio: 0.82,
            url: "https://d32dm0rphc51dk.cloudfront.net/WPV9hXX5oms437ujKpPdGg/larger.jpg",
          },
          href: "/artwork/hans-hofmann-untitled-221",
          sale: null,
          sale_message: "$5,000",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "1942",
        },
      },
      {
        node: {
          id: "QXJ0d29yazpwb2xseS1hcGZlbGJhdW0tbG92ZS1tZS10ZW5kZXItaWk=",
          slug: "polly-apfelbaum-love-me-tender-ii",
          title: "Love Me Tender II",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "polly-apfelbaum",
              name: "Polly Apfelbaum",
            },
          ],
          image: {
            aspect_ratio: 1,
            url: "https://d32dm0rphc51dk.cloudfront.net/HPFxUT7W1lV6UwRu3PvlRQ/larger.jpg",
          },
          href: "/artwork/polly-apfelbaum-love-me-tender-ii",
          sale: null,
          sale_message: "Sold",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "",
        },
      },
      {
        node: {
          id: "QXJ0d29yazpicmlkZ2V0LXJpbGV5LWJsdWUtZG9taW5hbmNl",
          slug: "bridget-riley-blue-dominance",
          title: "Blue Dominance",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "bridget-riley",
              name: "Bridget Riley",
            },
          ],
          image: {
            aspect_ratio: 0.5,
            url: "https://d32dm0rphc51dk.cloudfront.net/SvWPlpYA25k-5Kje-Lp8rg/medium.jpg",
          },
          href: "/artwork/bridget-riley-blue-dominance",
          sale: null,
          sale_message: "$15,000",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "1977",
        },
      },
      {
        node: {
          id:
            "QXJ0d29yazpwYWJsby1waWNhc3NvLW1vZGVsLWNvbnRlbXBsYXRpbmctYS1ncm91cC1vZi1zY3VscHR1cmVzLW1vZGVsZS1jb250ZW1wbGFudC11bi1ncm91cGUtc2N1bHB0ZQ==",
          slug: "pablo-picasso-model-contemplating-a-group-of-sculptures-modele-contemplant-un-groupe-sculpte",
          title: "Model Contemplating a Group of Sculptures (Modele Contemplant Un Groupe Sculpte)",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "pablo-picasso",
              name: "Pablo Picasso",
            },
          ],
          image: {
            aspect_ratio: 1.21,
            url: "https://d32dm0rphc51dk.cloudfront.net/leU66mGhe0D2OvMQmGRt4Q/large_rectangle.jpg",
          },
          href: "/artwork/pablo-picasso-model-contemplating-a-group-of-sculptures-modele-contemplant-un-groupe-sculpte",
          sale: null,
          sale_message: "Sold",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "1933",
        },
      },
      {
        node: {
          id: "QXJ0d29yazpkYWxlLWNoaWh1bHktY2VsdGljLWVtZXJhbGQtcGVyc2lhbi1wYWly",
          slug: "dale-chihuly-celtic-emerald-persian-pair",
          title: "Celtic Emerald Persian Pair",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "dale-chihuly",
              name: "Dale Chihuly",
            },
          ],
          image: {
            aspect_ratio: 1.5,
            url: "https://d32dm0rphc51dk.cloudfront.net/6hN0QtT-BQE2y8LGhiI3EA/medium.jpg",
          },
          href: "/artwork/dale-chihuly-celtic-emerald-persian-pair",
          sale: null,
          sale_message: "Sold",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "",
        },
      },
    ],
  },
  counts: {
    artists: 17,
    artworks: 21,
  },
  name: "Flickinger Collection",
  description:
    "Masterworks on paper, prints, paintings, and sculptures by mainstay postwar and contemporary artists are the focus in this exclusive exhibition showcasing the discerning connoisseurship of Tom & Penny Flickinger, lifelong collectors, and trustees of the Albright Knox Art Gallery.",
  press_release:
    "Paintings and Sculpture from the Sea Island Estate of the Flickingers will be offered for sale through the Anderson Fine Art Gallery, online and by appointment. Acquired over a 40 year period, the collection consists of post-war to contemporary paintings and works on paper.  The artwork was purchased from major dealers in New York, Chicago and London and reflects the passion, education and knowledge of Tom and Penny Flickinger whose intellectual discovery and visual pleasure guided their choices. \r\n\r\nThe collection includes works by Richard Diebenkorn, David Hockney, Joan Mitchell and Wolf Kahn, to name a few. A portion of the proceeds will be donated to the St. Simons Land Trust.",
  exhibition_period: "Jul 1 – Oct 30",
  images: [
    {
      url: "https://d32dm0rphc51dk.cloudfront.net/Bu7ONuoTlR-PLZDUjs6ZTA/medium.jpg",
      aspect_ratio: 0.87,
    },
  ],
  filterArtworksConnection: {
    id: "skfjhsfkljsdfsfsdjkll",
    pageInfo: {
      endCursor: "s;dlkfs;lkr43k;wlk4er",
      hasNextPage: false,
      startCursor: "2ol3i4u23lkj423lk;jre23;jkr",
    },
    aggregations: [
      {
        slice: "PRICE_RANGE",
        counts: [
          {
            value: "*-*",
            name: "for Sale",
          },
          {
            value: "10000-50000",
            name: "between $10,000 & $50,000",
          },
          {
            value: "5000-10000",
            name: "between $5,000 & $10,000",
          },
          {
            value: "1000-5000",
            name: "between $1,000 & $5,000",
          },
          {
            value: "*-1000",
            name: "Under $1,000",
          },
        ],
      },
      {
        slice: "MEDIUM",
        counts: [
          {
            value: "painting",
            name: "Painting",
          },
          {
            value: "prints",
            name: "Prints",
          },
          {
            value: "work-on-paper",
            name: "Work on Paper",
          },
          {
            value: "drawing",
            name: "Drawing",
          },
          {
            value: "sculpture",
            name: "Sculpture",
          },
        ],
      },
    ],
    edges: [
      {
        cursor: "2ol3i4u23lkj423lk;jre23;jkr",
        id: "23kej23jrlwkfjlsdkjsdflk",
        node: {
          __typename: "Artwork",
          id: "lk2qj3elk3jdfkjsdpoii",
          slug: "david-hockney-my-pool-and-terrace-4",
          is_offerable: false,
          title: "My Pool & Terrace",
          date: "1983",
          sale_message: "$13,000",
          is_biddable: false,
          is_acquireable: false,
          sale: null,
          sale_artwork: null,
          image: {
            url: "https://d32dm0rphc51dk.cloudfront.net/05rL1DSRwbn9t43xoYkiLg/large.jpg",
            aspect_ratio: 1.48,
            aspectRatio: 1.48,
          },
          artists: [
            {
              id: "lk12j34lk123j123123lkjada",
              name: "David Hockney",
            },
          ],
          partner: {
            id: "2lk3jerl23jesd;lfids;lkd",
            name: "Anderson Fine Art Gallery",
          },
          href: "/artwork/david-hockney-my-pool-and-terrace-4",
        },
      },
      {
        cursor: "asldfkjalkdjaskdj;jre23;jkr",
        id: "slfkslkfj342k2jkw;ldj",
        node: {
          __typename: "Artwork",
          id: "23krjwefkjskdjf;lks",
          slug: "bridget-riley-blue-dominance",
          title: "Blue Dominance",
          date: "1977",
          sale_message: "$15,000",
          is_biddable: false,
          is_acquireable: false,
          is_offerable: false,
          sale: null,
          sale_artwork: null,
          image: {
            url: "https://d32dm0rphc51dk.cloudfront.net/SvWPlpYA25k-5Kje-Lp8rg/large.jpg",
            aspect_ratio: 0.5,
            aspectRatio: 0.5,
          },
          artists: [
            {
              id: "as;eidfpwijrw3jrlszekfjs",
              name: "Bridget Riley",
            },
          ],
          partner: {
            id: "23periuwlfsudflkjdsflsj",
            name: "Anderson Fine Art Gallery",
          },
          href: "/artwork/bridget-riley-blue-dominance",
        },
      },
      {
        cursor: "wefdjw;fkope4ifrwefklsd",
        id: "s;dlfip234ir3kfse;dklfs",
        node: {
          __typename: "Artwork",
          id: "pro23kjflskdjsdjkf",
          slug: "hans-hofmann-untitled-221",
          title: "Untitled",
          date: "1942",
          sale_message: "$5,000",
          is_offerable: false,
          is_biddable: false,
          is_acquireable: false,
          sale: null,
          sale_artwork: null,
          image: {
            url: "https://d32dm0rphc51dk.cloudfront.net/WPV9hXX5oms437ujKpPdGg/large.jpg",
            aspect_ratio: 0.82,
            aspectRatio: 0.82,
          },
          artists: [
            {
              id: "kwqlejfhawekljfhasldkj",
              name: "Hans Hofmann",
            },
          ],
          partner: {
            id: "qweduwelkdfjsdlkj",
            name: "Anderson Fine Art Gallery",
          },
          href: "/artwork/hans-hofmann-untitled-221",
        },
      },
      {
        cursor: "2;3lkre;fklsd;ks;dlkfsd",
        id: "s;dlkfsd;lkf342;krw;l4fk",
        node: {
          __typename: "Artwork",
          id: "se;flkw;lk4rtks4efr",
          slug: "wolf-kahn-orchard-at-dusk",
          title: "Orchard at Dusk",
          date: "1989",
          sale_message: "$8,000",
          is_offerable: false,
          is_biddable: false,
          is_acquireable: false,
          sale: null,
          sale_artwork: null,
          image: {
            url: "https://d32dm0rphc51dk.cloudfront.net/7YGi2ogpyQW4Vl9gorV0dQ/large.jpg",
            aspect_ratio: 1.25,
            aspectRatio: 1.25,
          },
          artists: [
            {
              id: "dAL:eidfjqw3oduwl;eidfj",
              name: "Wolf Kahn",
            },
          ],
          partner: {
            id: "f;laewjfalew;kfjalwekj",
            name: "Anderson Fine Art Gallery",
          },
          href: "/artwork/wolf-kahn-orchard-at-dusk",
        },
      },
      {
        cursor: "q2;3lkr;lfksa;lkdfsadsf",
        id: "s;dfjkl43kr3kwr4fs;l",
        node: {
          __typename: "Artwork",
          id: "w;3kljrw;lkfdkjf;skld",
          slug: "wolf-kahn-in-ipswich-mass",
          title: "In Ipswich, Mass",
          date: "1987",
          sale_message: "$9,500",
          is_offerable: false,
          is_biddable: false,
          is_acquireable: false,
          sale: null,
          sale_artwork: null,
          image: {
            url: "https://d32dm0rphc51dk.cloudfront.net/qY9kBnLdh2EPkPZK8VuAaA/large.jpg",
            aspect_ratio: 1.35,
            aspectRatio: 1.35,
          },
          artists: [
            {
              id: "SFL:Sel;kjf23jr2lkj3",
              name: "Wolf Kahn",
            },
          ],
          partner: {
            id: "123lejdslcjsdlkj",
            name: "Anderson Fine Art Gallery",
          },
          href: "/artwork/wolf-kahn-in-ipswich-mass",
        },
      },
      {
        cursor: "s;dlkfs;lkr43k;wlk4er",
        id: "sd;klfjs;lfksl;kl;k4rt",
        node: {
          __typename: "Artwork",
          id: "lk2qj3elk3jdfkjsdpoii",
          slug: "marc-hanson-scrappy",
          title: "Scrappy",
          date: "ca. 2018",
          sale_message: "$10,300",
          is_offerable: false,
          is_biddable: false,
          is_acquireable: false,
          sale: null,
          sale_artwork: null,
          image: {
            url: "https://d32dm0rphc51dk.cloudfront.net/GSzNrBCUurMHdNEgT6LdwQ/large.jpg",
            aspect_ratio: 1.33,
            aspectRatio: 1.33,
          },
          artists: [
            {
              id: "wflksjdljwrl32kjklwej",
              name: "Marc Hanson",
            },
          ],
          partner: {
            id: "23kljrdsfljsdkljf",
            name: "Anderson Fine Art Gallery",
          },
          href: "/artwork/marc-hanson-scrappy",
        },
      },
    ],
  },
  artists_grouped_by_name: [
    {
      letter: "A",
      items: [
        {
          internalID: "polly-apfelbaum",
          initials: "PA",
          href: "/artist/polly-apfelbaum",
          sortable_id: "polly-apfelbaum",
          slug: "polly-apfelbaum",
          id: "QXJ0aXN0OnBvbGx5LWFwZmVsYmF1bQ==",
          name: "Polly Apfelbaum",
          is_followed: false,
          nationality: "American",
          birthday: "1955",
          deathday: "",
          image: {
            url: "https://d32dm0rphc51dk.cloudfront.net/MByqc96STE-fJtW4mZpgSg/tall.jpg",
          },
        },
        {
          internalID: "karel-appel",
          initials: "KA",
          href: "/artist/karel-appel",
          sortable_id: "karel-appel",
          slug: "karel-appel",
          id: "QXJ0aXN0OmthcmVsLWFwcGVs",
          name: "Karel Appel",
          is_followed: false,
          nationality: "Dutch",
          birthday: "1921",
          deathday: "2006",
          image: {
            url: "https://d32dm0rphc51dk.cloudfront.net/puxzysW1yY3FCRLFaLFEQQ/tall.jpg",
          },
        },
      ],
    },
    {
      letter: "B",
      items: [
        {
          internalID: "bruce-beasley",
          initials: "BB",
          href: "/artist/bruce-beasley",
          sortable_id: "bruce-beasley",
          slug: "bruce-beasley",
          id: "QXJ0aXN0OmJydWNlLWJlYXNsZXk=",
          name: "Bruce Beasley",
          is_followed: false,
          nationality: "American",
          birthday: "1939",
          deathday: "",
          image: {
            url: "https://d32dm0rphc51dk.cloudfront.net/XazCw3_7ZEQz-sdkLDWXjA/tall.jpg",
          },
        },
        {
          internalID: "nell-blaine",
          initials: "NB",
          href: "/artist/nell-blaine",
          sortable_id: "nell-blaine",
          slug: "nell-blaine",
          id: "QXJ0aXN0Om5lbGwtYmxhaW5l",
          name: "Nell Blaine",
          is_followed: false,
          nationality: "American",
          birthday: "1922",
          deathday: "1996",
          image: {
            url: "https://d32dm0rphc51dk.cloudfront.net/jr4zSDi7sXllVBNVhQardw/tall.jpg",
          },
        },
        {
          internalID: "carolyn-brady",
          initials: "CB",
          href: "/artist/carolyn-brady",
          sortable_id: "carolyn-brady",
          slug: "carolyn-brady",
          id: "QXJ0aXN0OmNhcm9seW4tYnJhZHk=",
          name: "Carolyn Brady",
          is_followed: false,
          nationality: "American",
          birthday: "1937",
          deathday: "2005",
          image: {
            url: "https://d32dm0rphc51dk.cloudfront.net/DH5Jtvy_a5d4Bb5hxB-Fxw/tall.jpg",
          },
        },
      ],
    },
    {
      letter: "C",
      items: [
        {
          internalID: "dale-chihuly",
          initials: "DC",
          href: "/artist/dale-chihuly",
          sortable_id: "dale-chihuly",
          slug: "dale-chihuly",
          id: "QXJ0aXN0OmRhbGUtY2hpaHVseQ==",
          name: "Dale Chihuly",
          is_followed: false,
          nationality: "American",
          birthday: "1941",
          deathday: "",
          image: {
            url: "https://d32dm0rphc51dk.cloudfront.net/qfT1qZw8EGJguSakyhFxig/tall.jpg",
          },
        },
      ],
    },
    {
      letter: "D",
      items: [
        {
          internalID: "richard-diebenkorn",
          initials: "RD",
          href: "/artist/richard-diebenkorn",
          sortable_id: "richard-diebenkorn",
          slug: "richard-diebenkorn",
          id: "QXJ0aXN0OnJpY2hhcmQtZGllYmVua29ybg==",
          name: "Richard Diebenkorn",
          is_followed: false,
          nationality: "American",
          birthday: "1922",
          deathday: "1993",
          image: {
            url: "https://d32dm0rphc51dk.cloudfront.net/C5GfncAzGMsMf6A6RSfJEQ/tall.jpg",
          },
        },
        {
          internalID: "jim-dine",
          initials: "JD",
          href: "/artist/jim-dine",
          sortable_id: "jim-dine",
          slug: "jim-dine",
          id: "QXJ0aXN0OmppbS1kaW5l",
          name: "Jim Dine",
          is_followed: false,
          nationality: "American",
          birthday: "1935",
          deathday: "",
          image: {
            url: "https://d32dm0rphc51dk.cloudfront.net/Ll4gMf_OsLMehbgv05H6mw/tall.jpg",
          },
        },
      ],
    },
    {
      letter: "F",
      items: [
        {
          internalID: "sam-francis",
          initials: "SF",
          href: "/artist/sam-francis",
          sortable_id: "sam-francis",
          slug: "sam-francis",
          id: "QXJ0aXN0OnNhbS1mcmFuY2lz",
          name: "Sam Francis",
          is_followed: false,
          nationality: "American",
          birthday: "1923",
          deathday: "1994",
          image: {
            url: "https://d32dm0rphc51dk.cloudfront.net/wZ9dabmVZjtcaB_q_bKKzw/tall.jpg",
          },
        },
      ],
    },
    {
      letter: "H",
      items: [
        {
          internalID: "robert-harms",
          initials: "RH",
          href: "/artist/robert-harms",
          sortable_id: "robert-harms",
          slug: "robert-harms",
          id: "QXJ0aXN0OnJvYmVydC1oYXJtcw==",
          name: "Robert Harms",
          is_followed: false,
          nationality: "",
          birthday: "1962",
          deathday: "",
          image: {
            url: "https://d32dm0rphc51dk.cloudfront.net/i5_X3qJO8gFiyHrlHvAb-w/tall.jpg",
          },
        },
        {
          internalID: "david-hockney",
          initials: "DH",
          href: "/artist/david-hockney",
          sortable_id: "david-hockney",
          slug: "david-hockney",
          id: "QXJ0aXN0OmRhdmlkLWhvY2tuZXk=",
          name: "David Hockney",
          is_followed: false,
          nationality: "British",
          birthday: "1937",
          deathday: "",
          image: {
            url: "https://d32dm0rphc51dk.cloudfront.net/kCJVZo7bcqVrjnQ22QHhvg/tall.jpg",
          },
        },
        {
          internalID: "hans-hofmann",
          initials: "HH",
          href: "/artist/hans-hofmann",
          sortable_id: "hans-hofmann",
          slug: "hans-hofmann",
          id: "QXJ0aXN0OmhhbnMtaG9mbWFubg==",
          name: "Hans Hofmann",
          is_followed: false,
          nationality: "German-American",
          birthday: "1880",
          deathday: "1966",
          image: {
            url: "https://d32dm0rphc51dk.cloudfront.net/vRQdNHjLuWKadBXy9Fl4Pg/tall.jpg",
          },
        },
      ],
    },
    {
      letter: "K",
      items: [
        {
          internalID: "wolf-kahn",
          initials: "WK",
          href: "/artist/wolf-kahn",
          sortable_id: "wolf-kahn",
          slug: "wolf-kahn",
          id: "QXJ0aXN0OndvbGYta2Fobg==",
          name: "Wolf Kahn",
          is_followed: false,
          nationality: "American",
          birthday: "1927",
          deathday: "",
          image: {
            url: "https://d32dm0rphc51dk.cloudfront.net/pzYQSjFUn7MyELRIVyADjQ/tall.jpg",
          },
        },
        {
          internalID: "ellsworth-kelly",
          initials: "EK",
          href: "/artist/ellsworth-kelly",
          sortable_id: "ellsworth-kelly",
          slug: "ellsworth-kelly",
          id: "QXJ0aXN0OmVsbHN3b3J0aC1rZWxseQ==",
          name: "Ellsworth Kelly",
          is_followed: false,
          nationality: "American",
          birthday: "1923",
          deathday: "2015",
          image: {
            url: "https://d32dm0rphc51dk.cloudfront.net/Bv9Hh3cYTCvc76NnZS4w4g/tall.jpg",
          },
        },
      ],
    },
    {
      letter: "M",
      items: [
        {
          internalID: "robert-motherwell",
          initials: "RM",
          href: "/artist/robert-motherwell",
          sortable_id: "robert-motherwell",
          slug: "robert-motherwell",
          id: "QXJ0aXN0OnJvYmVydC1tb3RoZXJ3ZWxs",
          name: "Robert Motherwell",
          is_followed: false,
          nationality: "American",
          birthday: "1915",
          deathday: "1991",
          image: {
            url: "https://d32dm0rphc51dk.cloudfront.net/BbPC9SljRn-_6AfewiQpxw/tall.jpg",
          },
        },
      ],
    },
    {
      letter: "P",
      items: [
        {
          internalID: "pablo-picasso",
          initials: "PP",
          href: "/artist/pablo-picasso",
          sortable_id: "pablo-picasso",
          slug: "pablo-picasso",
          id: "QXJ0aXN0OnBhYmxvLXBpY2Fzc28=",
          name: "Pablo Picasso",
          is_followed: false,
          nationality: "Spanish",
          birthday: "1881",
          deathday: "1973",
          image: {
            url: "https://d32dm0rphc51dk.cloudfront.net/i3rCA3IaKE-cLBnc-U5swQ/tall.jpg",
          },
        },
      ],
    },
    {
      letter: "R",
      items: [
        {
          internalID: "bridget-riley",
          initials: "BR",
          href: "/artist/bridget-riley",
          sortable_id: "bridget-riley",
          slug: "bridget-riley",
          id: "QXJ0aXN0OmJyaWRnZXQtcmlsZXk=",
          name: "Bridget Riley",
          is_followed: false,
          nationality: "British",
          birthday: "1931",
          deathday: "",
          image: {
            url: "https://d32dm0rphc51dk.cloudfront.net/zLIFDjlzCw8ijOH9PPeasA/tall.jpg",
          },
        },
      ],
    },
  ],
  events: [
    {
      event_type: "Opening Reception",
      description: "",
      start_at: "2018-11-02T18:00:00+00:00",
      end_at: "2018-11-02T21:00:00+00:00",
    },
    {
      event_type: "Guided Tour",
      description: "Keith Macgregor will take visitors around the gallery and share his stories.",
      start_at: "2018-11-10T11:00:00+00:00",
      end_at: "2018-11-10T12:00:00+00:00",
    },
    {
      event_type: "Artist Talk",
      description: "Meet and greet Keith Macgregor who will be glad to share his stories and answer your questions.",
      start_at: "2018-11-10T14:00:00+00:00",
      end_at: "2018-11-10T18:00:00+00:00",
    },
  ],
}
