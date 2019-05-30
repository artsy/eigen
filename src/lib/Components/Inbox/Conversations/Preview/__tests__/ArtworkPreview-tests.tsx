import { shallow } from "enzyme"
import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import ArtworkPreview from "../ArtworkPreview"

it("renders correctly", () => {
  const tree = renderer.create(<ArtworkPreview artwork={artwork as any} />)
  expect(tree).toMatchSnapshot()
})

it("handles dateless artworks", () => {
  const dateless = artwork
  dateless.date = ""
  const tree = renderer.create(<ArtworkPreview artwork={dateless as any} />)

  expect(tree).toMatchSnapshot()
})

describe("concerning selection handling", () => {
  it("passes a onPress handler to the touchable component if an onSelected handler is given", () => {
    const wrapper = shallow(<ArtworkPreview artwork={artwork as any} onSelected={() => null} />)
    const touchable = wrapper.find("TouchableHighlight")
    expect(touchable.props().onPress).toBeDefined()
  })

  it("does not pass a onPress handler to the touchable component if no onSelected handler is given", () => {
    const wrapper = shallow(<ArtworkPreview artwork={artwork as any} />)
    const touchable = wrapper.find("TouchableHighlight")
    expect(touchable.props().onPress).toBeUndefined()
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
