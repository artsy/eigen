import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { Artist } from "../Artist"

describe("availableTabs", () => {
  it("returns nothing if artist has no metadata, shows, or works", () => {
    const artist = new Artist()
    artist.props = artistProps(false)
    expect(artist.availableTabs()).toEqual([])
  })

  it("returns About tab if artist has metadata", () => {
    const artist = new Artist()
    artist.props = artistProps(true)
    expect(artist.availableTabs()).toEqual(["ABOUT"])
  })

  it("returns About tab if artist has articles", () => {
    const artist = new Artist()
    artist.props = artistProps(false, { articles: 1 })
    expect(artist.availableTabs()).toEqual(["ABOUT"])
  })

  it("returns Shows tab if artist has shows", () => {
    const artist = new Artist()
    artist.props = artistProps(false, { partner_shows: 2 })
    expect(artist.availableTabs()).toEqual(["SHOWS"])
  })

  it("returns Works tab if artist has works", () => {
    const artist = new Artist()
    artist.props = artistProps(false, { artworks: 2 })
    expect(artist.availableTabs()).toEqual(["WORKS"])
  })

  it("returns all three tabs if artist has metadata, works, and shows", () => {
    const artist = new Artist()
    artist.props = artistProps(true, { artworks: 1, partner_shows: 1 })
    expect(artist.availableTabs()).toEqual(["ABOUT", "WORKS", "SHOWS"])
  })
})

describe("after rendering", () => {
  it("mounts with Works tab selected if works exist", () => {
    const artist = new Artist()
    artist.props = artistProps(false, { artworks: 5 })

    const worksTabIndex = artist.availableTabs().indexOf("WORKS")

    artist.componentWillMount()
    expect(artist.state).toEqual({ selectedTabIndex: worksTabIndex })
  })

  it("mounts at the first tab index if artist has no works", () => {
    const artist = new Artist()
    artist.props = artistProps(true, { partner_shows: 1 })

    artist.componentWillMount()
    expect(artist.state).toEqual({ selectedTabIndex: 0 })
  })
})

describe("layout", () => {
  it("works as expected with no tabs", () => {
    const artist = renderer.create(<Artist artist={artistProps(false).artist} />)
    expect(artist.toJSON()).toMatchSnapshot()
  })

  it("works as expected with one tab", () => {
    const artist = renderer.create(<Artist artist={artistProps(true).artist} />)
    expect(artist.toJSON()).toMatchSnapshot()
  })

  it("works as expected with three tabs", () => {
    const artist = renderer.create(<Artist artist={artistProps(true, { artworks: 2, partner_shows: 1 }).artist} />)
    expect(artist.toJSON()).toMatchSnapshot()
  })
})

const artistProps = (hasMetadata: boolean, counts?: any) => {
  if (!counts) {
    counts = { articles: 0, partner_shows: 0, artworks: 0 }
  }
  return {
    artist: {
      _id: null,
      id: null,
      has_metadata: hasMetadata,
      counts,
      birthday: null,
      name: null,
      nationality: null,
      current_shows: null,
      upcoming_shows: null,
      past_small_shows: null,
      past_large_shows: null,
    },
  }
}
