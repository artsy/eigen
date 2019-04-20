import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { ArtistCard } from "../ArtistCard"

it("renders correctly", () => {
  const tree = renderer.create(<ArtistCard artist={artistProps(true).artist as any} />).toJSON()
  expect(tree).toMatchSnapshot()
})

it("only shows name and artwork count when bio is omitted", () => {
  const props = artistProps(false)
  const artistComponent = new ArtistCard(props as any)
  const metadata = artistComponent.renderMetadata()

  expect(metadata).toHaveLength(2)
  expect(metadata[0].props.children).toEqual(props.artist.name.toUpperCase())
  expect(metadata[1].props.children).toEqual(props.artist.formatted_artworks_count)
})

const artistProps = (hasBio: boolean) => {
  return {
    artist: {
      id: "QXJ0aXN0Omp1YW4tZ3Jpcw==",
      formatted_artworks_count: "14 works, 3 for sale",
      formatted_nationality_and_birthday: hasBio ? "Spanish, 1887–1927" : "",
      href: "/artist/juan-gris",
      gravityID: "juan-gris",
      internalID: "4d8b934a4eb68a1b2c0012a1",
      image: {
        url: "https://d32dm0rphc51dk.cloudfront.net/wGMxL6TvlSORJzEHZsK9JA/large.jpg",
      },
      name: "Juan Gris",
    },
  }
}
