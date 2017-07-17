import * as React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import ArtworkPreview from "../ArtworkPreview"

it("renders correctly", () => {
  const tree = renderer.create(<ArtworkPreview artwork={artwork} />)
  expect(tree).toMatchSnapshot()
})

it("handles dateless artworks", () => {
  const dateless = artwork
  dateless.date = ""
  const tree = renderer.create(<ArtworkPreview artwork={dateless} />)

  expect(tree).toMatchSnapshot()
})

const artwork = {
  id: "bradley-theodore-karl-and-anna-face-off-diptych",
  href: "/artwork/bradley-theodore-karl-and-anna-face-off-diptych",
  title: "Karl and Anna Face Off (Diptych)",
  date: "2016",
  artist_names: "Bradley Theodore",
  image: {
    url: "https://d32dm0rphc51dk.cloudfront.net/bJ9I_vJX9ksaKFJAkOAIKg/normalized.jpg",
  },
}
