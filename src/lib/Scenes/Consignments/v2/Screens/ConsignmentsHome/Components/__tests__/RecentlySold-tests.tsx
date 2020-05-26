import { Theme } from "@artsy/palette"
import React from "react"
import "react-native"
import { create } from "react-test-renderer"

import { RecentlySold_artists } from "__generated__/RecentlySold_artists.graphql"
import { extractText } from "lib/tests/extractText"
import { RecentlySold } from "../RecentlySold"

describe("RecentlySold", () => {
  const defaultArtist: any = {
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
    const artists = makeArtists(artist)

    const tree = create(
      <Theme>
        <RecentlySold artists={artists} />
      </Theme>
    )

    expect(extractText(tree.root)).toContain("Sold for $1,200")
  })

  it("does not render any sale message if artwork has no realized price", () => {
    const artist = {
      ...defaultArtist,
      realizedPrice: null,
    }
    const artists = makeArtists(artist)

    const tree = create(
      <Theme>
        <RecentlySold artists={artists} />
      </Theme>
    )

    expect(extractText(tree.root)).not.toContain("Sold for")
  })
})

function makeArtists(artist: any): RecentlySold_artists {
  return [
    {
      " $refType": "RecentlySold_artists",
      internalID: "1234",
      targetSupply: {
        microfunnel: {
          artworksConnection: {
            edges: [
              {
                node: artist,
              },
            ],
          },
        },
      },
    },
  ]
}
