import { mount } from "enzyme"
import { ArtworkFixture } from "lib/__fixtures__/ArtworkFixture"
import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import React from "react"
import { Header } from "../../../Header"
import { RelatedArtworkGrid } from "../RelatedArtworkGrid"

describe("RelatedArtworkGrid", () => {
  it("renders RelatedArtworkGrid with correct components", () => {
    const component = mount(<RelatedArtworkGrid artwork={ArtworkFixture} />)
    expect(component.find(Header).length).toEqual(1)
    expect(
      component
        .find(Header)
        .at(0)
        .render()
        .text()
    ).toEqual("Related Works")
    expect(component.find(GenericGrid).length).toEqual(1)
    expect(component.find(GenericGrid).props().artworks.length).toEqual(8)
  })

  it("does not include grid when there are no artworks", () => {
    const artworkWithoutRelatedArtworks = {
      ...ArtworkFixture,
      layer: {
        artworksConnection: {
          edges: [],
        },
      },
    }
    const component = mount(<RelatedArtworkGrid artwork={artworkWithoutRelatedArtworks} />)
    expect(component.text()).toEqual(null)
  })
})
