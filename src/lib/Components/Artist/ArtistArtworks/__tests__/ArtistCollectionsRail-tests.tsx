import { Theme } from "@artsy/palette"
import { GenericArtistSeriesRail } from "lib/Components/GenericArtistSeriesRail"
import React from "react"
import * as renderer from "react-test-renderer"
import { ArtistCollectionsRail } from "../ArtistCollectionsRail"

jest.unmock("react-relay")

it("renders without throwing an error with all props", () => {
  renderer.create(
    <Theme>
      <ArtistCollectionsRail collections={mockData as any /* @ts-ignore STRICTNESS_MIGRATION */} />
    </Theme>
  )
})

it("renders without throwing an error with null props", () => {
  renderer.create(
    <Theme>
      <ArtistCollectionsRail collections={null} />
    </Theme>
  )
})

it("renders artist series rail if iconic collections", () => {
  const root = renderer.create(
    <Theme>
      <ArtistCollectionsRail collections={mockData as any /* @ts-ignore STRICTNESS_MIGRATION */} />
    </Theme>
  ).root

  expect(root.findAllByType(GenericArtistSeriesRail)).toHaveLength(1)
})

const mockData = [
  " $fragmentRefs",
  {
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
]
