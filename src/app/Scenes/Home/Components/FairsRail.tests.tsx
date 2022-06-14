import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { cloneDeep } from "lodash"
import React from "react"
import "react-native"

import { FairsRail_fairsModule$data } from "__generated__/FairsRail_fairsModule.graphql"
import { extractText } from "app/tests/extractText"
import { FairsRailFragmentContainer } from "./FairsRail"

import { CardRailCard } from "app/Components/Home/CardRailCard"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/navigation/navigate"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { CleanRelayFragment } from "app/utils/relayHelpers"
import { Text } from "palette"
import HomeAnalytics from "../homeAnalytics"

const mockScrollRef = jest.fn()
const artworkNode = {
  node: {
    image: { url: "https://example.com/image.jpg" },
  },
}

const emptyFairsModule: CleanRelayFragment<FairsRail_fairsModule$data> = {
  results: [],
}
const fairsModule: CleanRelayFragment<FairsRail_fairsModule$data> = {
  results: [
    {
      id: "the-fair",
      internalID: "the-fair-internal-id",
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
      internalID: "the-fair-internal-id",
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

it("renders without throwing an error", () => {
  renderWithWrappers(
    <FairsRailFragmentContainer
      title="Fairs"
      fairsModule={fairsModule as any}
      scrollRef={mockScrollRef}
    />
  )
})

it("renders results when there are fairs returned", () => {
  const tree = renderWithWrappers(
    <FairsRailFragmentContainer
      title="Featured Fairs"
      fairsModule={fairsModule as any}
      scrollRef={mockScrollRef}
    />
  )
  expect(tree.root.findAllByType(Text)[0].props.children).toMatch("Featured Fairs")
})

it("does not render results when there are no fairs returned", () => {
  const tree = renderWithWrappers(
    <FairsRailFragmentContainer
      title="Fairs"
      fairsModule={emptyFairsModule as any}
      scrollRef={mockScrollRef}
    />
  )
  expect(tree.root.findAllByType(SectionTitle).length).toEqual(0)
})

it("renders without throwing an error when missing artworks", () => {
  const fairsCopy = cloneDeep(fairsModule)
  fairsCopy.results.forEach((result) => {
    // @ts-ignore
    result.followedArtistArtworks.edges = []
    // @ts-ignore
    result.otherArtworks.edges = []
  })
  expect(() =>
    renderWithWrappers(
      <FairsRailFragmentContainer
        title="Fairs"
        fairsModule={fairsCopy as any}
        scrollRef={mockScrollRef}
      />
    )
  ).not.toThrow()
})

describe("location", () => {
  it("handles when the city is specified", () => {
    const fairsCopy = cloneDeep(fairsModule)
    // @ts-ignore
    fairsCopy.results[0].location.city = "New Yawk"
    const tree = renderWithWrappers(
      <FairsRailFragmentContainer
        title="Fairs"
        fairsModule={fairsCopy as any}
        scrollRef={mockScrollRef}
      />
    )
    expect(
      extractText(tree.root.findAllByProps({ testID: "card-subtitle" })[0])
    ).toMatchInlineSnapshot(`"Monday–Friday  •  New Yawk"`)
  })

  it("handles falls back to country when city is unspecified", () => {
    const fairsCopy = cloneDeep(fairsModule)
    // @ts-ignore
    fairsCopy.results[0].location.country = "Canada"
    const tree = renderWithWrappers(
      <FairsRailFragmentContainer
        title="Fairs"
        fairsModule={fairsCopy as any}
        scrollRef={mockScrollRef}
      />
    )
    expect(
      extractText(tree.root.findAllByProps({ testID: "card-subtitle" })[0])
    ).toMatchInlineSnapshot(`"Monday–Friday  •  Canada"`)
  })
})

describe("navigation", () => {
  it("navigates to the fair url", () => {
    const tree = renderWithWrappers(
      <FairsRailFragmentContainer
        title="Fairs"
        fairsModule={fairsModule as any}
        scrollRef={mockScrollRef}
      />
    )
    const cards = tree.root.findAllByType(CardRailCard)
    cards[0].props.onPress()
    expect(navigate).toHaveBeenCalledWith("/fair/the-fair")
  })
})

describe("analytics", () => {
  it("tracks fair thumbnail taps", () => {
    const fairsCopy = cloneDeep(fairsModule)
    const tree = renderWithWrappers(
      <FairsRailFragmentContainer
        title="Fairs"
        fairsModule={fairsCopy as any}
        scrollRef={mockScrollRef}
      />
    )
    const cards = tree.root.findAllByType(CardRailCard)
    cards[0].props.onPress()
    expect(mockTrackEvent).toHaveBeenCalledWith(
      HomeAnalytics.fairThumbnailTapEvent("the-fair-internal-id", "the-fair", 0)
    )
  })
})
