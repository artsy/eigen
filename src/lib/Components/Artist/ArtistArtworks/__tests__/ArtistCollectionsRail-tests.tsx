import { Theme } from "@artsy/palette"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { graphql } from "react-relay"
import { ArtistCollectionsRailFragmentContainer as ArtistCollectionsRail } from "../ArtistCollectionsRail"

jest.unmock("react-relay")

it("renders the artist collection rail component without throwing an error", async () => {
  await renderRelayTree({
    Component: (props: any) => (
      <Theme>
        <ArtistCollectionsRail collections={mockData.collections} {...props} />
      </Theme>
    ),
    query: graphql`
      query ArtistCollectionsRailTestsQuery @raw_response_type {
        marketingCollection(slug: "any-slug") {
          slug
          title
          priceGuidance
          artworksConnection(first: 3, aggregations: [TOTAL], sort: "-decayed_merch") {
            edges {
              node {
                title
                image {
                  url
                }
              }
            }
          }
        }
      }
    `,
    mockData: { marketingCollections: mockData },
  })
})

const mockData = {
  collections: [
    {
      " $fragmentRefs": null,
      slug: "cindy-sherman-untitled-film-stills",
      title: "Cindy Sherman: Untitled Film Stills",
      priceGuidance: 20000,
      artworksConnection: {
        edges: [
          {
            node: {
              title: "Untitled (Film Still) Tray",
              image: {
                url: "https://cindy-sherman-untitled-film-stills/medium.jpg",
              },
            },
          },
          {
            node: {
              title: "Untitled (Film Still) Tray 2",
              image: {
                url: "https://cindy-sherman-untitled-film-stills-2/medium.jpg",
              },
            },
          },
          {
            node: {
              title: "Untitled (Film Still) Tray 3",
              image: {
                url: "https://cindy-sherman-untitled-film-stills-3/medium.jpg",
              },
            },
          },
        ],
      },
    },
    {
      " $fragmentRefs": null,
      slug: "damien-hirst-butterflies",
      title: "Damien Hirst: Butterflies",
      priceGuidance: 7500,
      artworksConnection: {
        edges: [
          {
            node: {
              title: "Untitled (Film Still) Tray",
              image: {
                url: "https://damien-hirst-butterflies/larger.jpg",
              },
            },
          },
          {
            node: {
              title: "Untitled (Film Still) Tray 2",
              image: {
                url: "https://damien-hirst-butterflies-2/larger.jpg",
              },
            },
          },
          {
            node: {
              title: "Untitled (Film Still) Tray 3",
              image: {
                url: "https://damien-hirst-butterflies-3/larger.jpg",
              },
            },
          },
        ],
      },
    },
    {
      " $fragmentRefs": null,
      slug: "hunt-slonem-bunnies",
      title: "Hunt Slonem: Bunnies",
      priceGuidance: 2000,
      artworksConnection: {
        edges: [
          {
            node: {
              title: "Untitled",
              image: {
                url: "https://hunt-slonem-bunnies/medium.jpg",
              },
            },
          },
          {
            node: {
              title: "Untitled2",
              image: {
                url: "https://hunt-slonem-bunnies-2/medium.jpg",
              },
            },
          },
          {
            node: {
              title: "Untitled3",
              image: {
                url: "https://hunt-slonem-bunnies-3/medium.jpg",
              },
            },
          },
        ],
      },
    },
  ],
}
