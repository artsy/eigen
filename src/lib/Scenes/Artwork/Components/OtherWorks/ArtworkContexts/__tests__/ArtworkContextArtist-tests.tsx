import { mount } from "enzyme"
import { ArtworkFixture } from "lib/__fixtures__/ArtworkFixture"
import React from "react"
import { ArtworkContextArtistFragmentContainer as ArtworkContextArtist } from "../ArtworkContextArtist"
import { ArtistArtworkGrid } from "../ArtworkGrids/ArtistArtworkGrid"
import { PartnerArtworkGrid } from "../ArtworkGrids/PartnerArtworkGrid"

describe("PartnerArtworkGrid", () => {
  it("renders PartnerArtworkGrid with correct components", () => {
    const component = mount(<ArtworkContextArtist artwork={ArtworkFixture} />)
    expect(component.find(ArtistArtworkGrid).length).toEqual(1)
    expect(component.find(PartnerArtworkGrid).length).toEqual(1)
  })
})
