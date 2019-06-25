import { mount } from "enzyme"
import { ArtworkFixture } from "lib/__fixtures__/ArtworkFixture"
import React from "react"
import { Artwork } from "../Artwork"
import { ArtworkHeader } from "../Components/ArtworkHeader"

describe("Artwork", () => {
  it("renders a snapshot", () => {
    const component = mount(<Artwork artwork={ArtworkFixture} />)
    expect(component.find(ArtworkHeader).length).toEqual(1)
  })
})
