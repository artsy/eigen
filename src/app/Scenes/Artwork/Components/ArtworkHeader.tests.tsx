import { ArtworkFixture } from "app/__fixtures__/ArtworkFixture"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { ArtworkActions } from "./ArtworkActions"
import { ArtworkHeader } from "./ArtworkHeader"
import { ArtworkTombstone } from "./ArtworkTombstone"
import { ImageCarousel } from "./ImageCarousel/ImageCarousel"

jest.mock("react-native-view-shot", () => ({}))

const TestRenderer: React.FC = () => {
  return <ArtworkHeader artwork={ArtworkFixture} />
}

describe("ArtworkHeader", () => {
  it("renders tombstone component", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    expect(tree.root.findAllByType(ArtworkTombstone)).toHaveLength(1)
  })

  it("renders artwork actions component", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    expect(tree.root.findAllByType(ArtworkActions)).toHaveLength(1)
  })

  it("renders image carousel component", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    expect(tree.root.findAllByType(ImageCarousel)).toHaveLength(1)
  })
})
