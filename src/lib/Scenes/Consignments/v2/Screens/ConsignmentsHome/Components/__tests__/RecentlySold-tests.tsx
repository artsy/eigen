import { Theme } from "@artsy/palette"
import React from "react"
import "react-native"
import { create } from "react-test-renderer"

import { RecentlySold_targetSupply } from "__generated__/RecentlySold_targetSupply.graphql"
import { extractText } from "lib/tests/extractText"
import { RecentlySold } from "../RecentlySold"

type RecentySold_artwork = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<NonNullable<RecentlySold_targetSupply["microfunnel"]>[number]>["artworksConnection"]
    >["edges"]
  >[number]
>["node"]

describe("RecentlySold", () => {
  const defaultArtist: RecentySold_artwork = {
    artistNames: "Andy Goldsworthy",
    href: "/artist/andy-goldsworthy",
    image: {
      imageURL: "http://placekitten.com/200/200",
    },
    internalID: "1235",
    realizedPrice: "$1,200",
    slug: "andy-goldsworthy",
  }

  it("renders sale message if artwork has realized price", () => {
    const artist = {
      ...defaultArtist,
      realizedPrice: "$1,200",
    }
    const targetSupply = makeTargetSupply([artist])

    const tree = create(
      <Theme>
        <RecentlySold targetSupply={targetSupply} />
      </Theme>
    )

    expect(extractText(tree.root)).toContain("Sold for $1,200")
  })

  it("does not render any sale message if artwork has no realized price", () => {
    const artist = {
      ...defaultArtist,
      realizedPrice: null,
    }
    const targetSupply = makeTargetSupply([artist])

    const tree = create(
      <Theme>
        <RecentlySold targetSupply={targetSupply} />
      </Theme>
    )

    expect(extractText(tree.root)).not.toContain("Sold for")
  })

  it("renders an artwork for each artist", () => {
    const targetSupply = makeTargetSupply([
      {
        ...defaultArtist,
        artistNames: "artist #1",
      },
      {
        ...defaultArtist,
        artistNames: "artist #2",
      },
      {
        ...defaultArtist,
        artistNames: "artist #3",
      },
      {
        ...defaultArtist,
        artistNames: "artist #4",
      },
      {
        ...defaultArtist,
        artistNames: "artist #5",
      },
    ])

    const tree = create(
      <Theme>
        <RecentlySold targetSupply={targetSupply} />
      </Theme>
    )

    const text = extractText(tree.root)
    expect(text).toContain("artist #1")
    expect(text).toContain("artist #2")
    expect(text).toContain("artist #3")
    expect(text).toContain("artist #4")
    expect(text).toContain("artist #5")
  })
})

function makeTargetSupply(artists: RecentySold_artwork[]): RecentlySold_targetSupply {
  const items = artists.map(artist => {
    return {
      artworksConnection: {
        edges: [
          {
            node: artist,
          },
        ],
      },
    }
  })

  return {
    " $refType": null as any,
    microfunnel: items,
  }
}
