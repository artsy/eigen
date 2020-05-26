import { Theme } from "@artsy/palette"
import React from "react"
import "react-native"
import { create } from "react-test-renderer"

import { ArtistList_targetSupply } from "__generated__/ArtistList_targetSupply.graphql"
import { extractText } from "lib/tests/extractText"
import { ArtistList } from "../ArtistList"

describe("ArtistList", () => {
  const defaultArtist: any = {
    name: "Alex Katz",
    href: "/artist/alex-katz",
    image: {
      cropped: {
        url:
          "https://d196wkiy8qx2u5.cloudfront.net?resize_to=fill&width=76&height=70&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FbrHdWfNxoereaVk2VOneuw%2Flarge.jpg",
        width: 76,
        height: 70,
      },
    },
  }

  it("renders an item for each artist", () => {
    const targetSupply = makeTargetSupply([
      { ...defaultArtist, name: "artist #1" },
      { ...defaultArtist, name: "artist #2" },
      { ...defaultArtist, name: "artist #3" },
      { ...defaultArtist, name: "artist #4" },
      { ...defaultArtist, name: "artist #5" },
    ])

    const tree = create(
      <Theme>
        <ArtistList targetSupply={targetSupply} />
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

function makeTargetSupply(artists: any[]): ArtistList_targetSupply {
  return {
    " $refType": null as any,
    microfunnel: artists.map(artist => {
      return {
        artist,
      }
    }),
  }
}
