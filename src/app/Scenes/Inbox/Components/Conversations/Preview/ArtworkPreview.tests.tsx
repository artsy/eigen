import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import "react-native"

import ArtworkPreview from "./ArtworkPreview"

import { Touchable } from "palette"

describe("concerning selection handling", () => {
  it("passes a onPress handler to the touchable component if an onSelected handler is given", () => {
    const tree = renderWithWrappers(
      <ArtworkPreview artwork={artwork as any} onSelected={() => null} />
    )
    expect(tree.root.findByType(Touchable).props.onPress).toBeTruthy()
  })

  it("does not pass a onPress handler to the touchable component if no onSelected handler is given", () => {
    const tree = renderWithWrappers(<ArtworkPreview artwork={artwork as any} />)
    expect(tree.root.findByType(Touchable).props.onPress).toBeFalsy()
  })
})

const artwork = {
  id: "bradley-theodore-karl-and-anna-face-off-diptych",
  internalID: "mongoID",
  href: "/artwork/bradley-theodore-karl-and-anna-face-off-diptych",
  title: "Karl and Anna Face Off (Diptych)",
  date: "2016",
  artist_names: "Bradley Theodore",
  image: {
    url: "https://d32dm0rphc51dk.cloudfront.net/bJ9I_vJX9ksaKFJAkOAIKg/normalized.jpg",
  },
}
