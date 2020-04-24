// @ts-ignore STRICTNESS_MIGRATION
import { shallow } from "enzyme"
import { ArtworkFixture } from "lib/__fixtures__/ArtworkFixture"
import React from "react"
import { ArtworkActions } from "../ArtworkActions"
import { ArtworkHeader } from "../ArtworkHeader"
import { ArtworkTombstone } from "../ArtworkTombstone"
import { ImageCarousel } from "../ImageCarousel/ImageCarousel"

describe("ArtworkHeader", () => {
  it("renders tombstone component", () => {
    // @ts-ignore STRICTNESS_MIGRATION
    const component = shallow(<ArtworkHeader artwork={ArtworkFixture} />)
    expect(component.find(ArtworkTombstone).length).toEqual(1)
  })

  it("renders artwork actions component", () => {
    // @ts-ignore STRICTNESS_MIGRATION
    const component = shallow(<ArtworkHeader artwork={ArtworkFixture} />)
    expect(component.find(ArtworkActions).length).toEqual(1)
  })

  it("renders image carousel component", () => {
    // @ts-ignore STRICTNESS_MIGRATION
    const component = shallow(<ArtworkHeader artwork={ArtworkFixture} />)
    expect(component.find(ImageCarousel).length).toEqual(1)
  })
})
