import { cloneDeep } from "lodash"
import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { FairsRail_fairsModule } from "__generated__/FairsRail_fairsModule.graphql"
import { extractText } from "lib/tests/extractText"
import FairsRail from "../FairsRail"

import { Theme } from "@artsy/palette"

const artworkNode = {
  node: {
    image: { url: "https://example.com/image.jpg" },
  },
}
const fairsModule: Omit<FairsRail_fairsModule, " $refType"> = {
  results: [
    {
      id: "the-fair",
      name: "The Fair",
      slug: "the-fair",
      exhibitionPeriod: "Monday–Friday",
      location: {
        city: null,
        country: null,
      },
      profile: { slug: "https://neopets.com" },
      image: { url: "https://example.com/hero.jpg" },
      followedArtistArtworks: {
        edges: [artworkNode, artworkNode, artworkNode],
      },
      otherArtworks: {
        edges: [artworkNode, artworkNode, artworkNode],
      },
    },
    {
      id: "the-profileless-fair",
      slug: "the-profileless-fair",
      name: "The Profileless Fair: You Should Not See Me in Snapshots",
      exhibitionPeriod: "Monday–Friday",
      location: {
        city: null,
        country: null,
      },
      profile: null,
      image: { url: "https://example.com/hero.jpg" },
      followedArtistArtworks: {
        edges: [artworkNode, artworkNode],
      },
      otherArtworks: {
        edges: [artworkNode, artworkNode],
      },
    },
  ],
}

it("looks correct when rendered", () => {
  const tree = renderer
    .create(
      <Theme>
        <FairsRail fairsModule={fairsModule as any} />
      </Theme>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})

it("looks correct when rendered with fairs missing artworks", () => {
  const fairsCopy = cloneDeep(fairsModule)
  fairsCopy.results.forEach(result => {
    // @ts-ignore
    result.followedArtistArtworks.edges = []
    // @ts-ignore
    result.otherArtworks.edges = []
  })
  expect(() =>
    renderer
      .create(
        <Theme>
          <FairsRail fairsModule={fairsModule as any} />
        </Theme>
      )
      .toJSON()
  ).not.toThrow()
})

describe("location", () => {
  it("handles when the city is specified", () => {
    const fairsCopy = cloneDeep(fairsModule)
    // @ts-ignore
    fairsCopy.results[0].location.city = "New Yawk"
    const tree = renderer.create(
      <Theme>
        <FairsRail fairsModule={fairsCopy as any} />
      </Theme>
    )
    expect(extractText(tree.root.findAllByProps({ "data-test-id": "subtitle" })[0])).toMatchInlineSnapshot(
      `"Monday–Friday  •  New Yawk"`
    )
  })

  it("handles falls back to country when city is unspecified", () => {
    const fairsCopy = cloneDeep(fairsModule)
    // @ts-ignore
    fairsCopy.results[0].location.country = "Canada"
    const tree = renderer.create(
      <Theme>
        <FairsRail fairsModule={fairsCopy as any} />
      </Theme>
    )
    expect(extractText(tree.root.findAllByProps({ "data-test-id": "subtitle" })[0])).toMatchInlineSnapshot(
      `"Monday–Friday  •  Canada"`
    )
  })
})
