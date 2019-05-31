import { mount } from "enzyme"
import { ArtworkFixture } from "lib/__fixtures__/ArtworkFixture"
import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import React from "react"
import { Header } from "../../../Header"
import { PartnerArtworkGrid } from "../PartnerArtworkGrid"

describe("PartnerArtworkGrid", () => {
  it("renders PartnerArtworkGrid with correct components", () => {
    const component = mount(<PartnerArtworkGrid artwork={ArtworkFixture} />)
    expect(component.find(Header).length).toEqual(1)
    expect(
      component
        .find(Header)
        .at(0)
        .render()
        .text()
    ).toEqual("Other works from CAMA Gallery")
    expect(component.find(GenericGrid).length).toEqual(1)
    expect(component.find(GenericGrid).props().artworks.length).toEqual(8)
  })

  it("does not include grid when there are no artworks", () => {
    const artworkWithoutPartnerArtworks = {
      ...ArtworkFixture,
      partner: {
        name: "CAMA Gallery",
        artworksConnection: {
          edges: [],
        },
      },
    }
    const component = mount(<PartnerArtworkGrid artwork={artworkWithoutPartnerArtworks} />)
    expect(component.text()).toEqual(null)
  })
})
